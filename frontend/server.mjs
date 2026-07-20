import express from 'express'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const NOT_AVAILABLE = 'N/A'
const MISSING_FILE_VALUE = 'ERROR: File does not exist'
const BACKEND_NOT_CONFIGURED = 'ERROR: Backend not configured'
const BACKEND_NOT_REACHABLE = 'ERROR: Backend not reachable'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDirectory = path.join(__dirname, 'dist')
const DEFAULT_STARTUP_DELAY_MS = 30_000
const DEFAULT_BASE_PATH = '/'

let indexTemplatePromise

function hasValue(value) {
  return typeof value === 'string' && value.length > 0
}

function normalizeBasePath(value) {
  if (!hasValue(value)) {
    return DEFAULT_BASE_PATH
  }

  const trimmed = value.trim()
  if (trimmed === '' || trimmed === DEFAULT_BASE_PATH) {
    return DEFAULT_BASE_PATH
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, '')
  return withoutTrailingSlash === '' ? DEFAULT_BASE_PATH : withoutTrailingSlash
}

function prefixedPath(basePath, routePath) {
  if (basePath === DEFAULT_BASE_PATH) {
    return routePath
  }

  return `${basePath}${routePath}`
}

function routePaths(basePath, routePath) {
  if (basePath === DEFAULT_BASE_PATH) {
    return [routePath]
  }

  return [routePath, prefixedPath(basePath, routePath)]
}

async function readIndexTemplate() {
  if (!indexTemplatePromise) {
    indexTemplatePromise = readFile(path.join(distDirectory, 'index.html'), 'utf-8')
  }

  return indexTemplatePromise
}

async function sendIndexHtml(response, basePath) {
  const template = await readIndexTemplate()
  const runtimeBasePathScript = `<script>window.__APP_BASE_PATH__=${JSON.stringify(basePath)};</script>`

  if (template.includes('</head>')) {
    response.type('html').send(template.replace('</head>', `  ${runtimeBasePathScript}\n  </head>`))
    return
  }

  response.type('html').send(`${runtimeBasePathScript}\n${template}`)
}

function valueOrDefault(value) {
  return hasValue(value) ? value : NOT_AVAILABLE
}

async function fileContentOrStatus(filePath) {
  if (!hasValue(filePath)) {
    return NOT_AVAILABLE
  }

  try {
    return await readFile(filePath, 'utf-8')
  } catch {
    return MISSING_FILE_VALUE
  }
}

function toBackendUrl(backendService, endpoint) {
  const normalizedBase = backendService.endsWith('/') ? backendService : `${backendService}/`
  return new URL(endpoint, normalizedBase)
}

async function configFileVolContent(backendService, configFileVol) {
  if (!hasValue(backendService)) {
    return BACKEND_NOT_CONFIGURED
  }

  if (!hasValue(configFileVol)) {
    return NOT_AVAILABLE
  }

  try {
    const url = toBackendUrl(backendService, 'getContent')
    url.searchParams.set('path', configFileVol)

    const response = await fetch(url, { method: 'GET' })

    if (!response.ok) {
      try {
        const body = await response.json()
        if (body && typeof body.error === 'string') {
          return body.error
        }
      } catch {
        // Keep fallback behavior when response is not JSON.
      }

      return `ERROR: Backend returned ${response.status}`
    }

    return await response.text()
  } catch {
    return BACKEND_NOT_REACHABLE
  }
}

export function createApp({ startupDelayMs = DEFAULT_STARTUP_DELAY_MS, now = Date.now } = {}) {
  const app = express()
  app.use(express.json())
  const basePath = normalizeBasePath(process.env.FRONTEND_BASE_PATH ?? process.env.BASE_PATH)

  let isUnhealthy = false
  const startupStartedAt = now()
  const healthPathSet = new Set([
    ...routePaths(basePath, '/health'),
    ...routePaths(basePath, '/api/health-state'),
  ])

  function isInStartupDelay() {
    return now() - startupStartedAt < startupDelayMs
  }

  app.use((request, response, next) => {
    if (healthPathSet.has(request.path)) {
      next()
      return
    }

    if (isUnhealthy) {
      response.status(503).json({ error: 'Frontend server is unhealthy' })
      return
    }

    if (!isInStartupDelay()) {
      next()
      return
    }

    response.status(503).json({ error: 'Frontend server is starting up' })
  })

  app.get(routePaths(basePath, '/api/runtime-config'), async (_request, response) => {
    const configVar1 = process.env.CONFIG_VAR1
    const secret1 = process.env.SECRET1
    const configFile = process.env.CONFIG_FILE
    const configFileVol = process.env.CONFIG_FILE_VOL
    const backendService = process.env.BACKEND_SERVICE

    const payload = {
      CONFIG_VAR1: valueOrDefault(configVar1),
      SECRET1: valueOrDefault(secret1),
      CONFIG_FILE: valueOrDefault(configFile),
      CONFIG_FILE_CONTENT: await fileContentOrStatus(configFile),
      CONFIG_FILE_VOL: valueOrDefault(configFileVol),
      CONFIG_FILE_VOL_CONTENT: await configFileVolContent(backendService, configFileVol),
      BACKEND_SERVICE: valueOrDefault(backendService),
    }

    response.json(payload)
  })

  app.post(routePaths(basePath, '/api/visit-log'), async (request, response) => {
    const payload = typeof request.body === 'object' && request.body !== null ? request.body : {}

    const page = hasValue(payload.page) ? payload.page : 'unknown'
    const userAgent = hasValue(payload.userAgent) ? payload.userAgent : 'unknown'
    const timestamp = hasValue(payload.timestamp) ? payload.timestamp : new Date().toISOString()
    const backendService = process.env.BACKEND_SERVICE

    if (!hasValue(backendService)) {
      response.json({ status: 'skipped' })
      return
    }

    const message = `time=${timestamp}; userAgent=${userAgent}; page=${page}`

    try {
      const url = toBackendUrl(backendService, 'log')
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
    } catch {
      // Intentionally ignored: logging should never break user flow.
    }

    response.json({ status: 'ok' })
  })

  app.get(routePaths(basePath, '/api/health-state'), (_request, response) => {
    response.json({ isUnhealthy })
  })

  app.post(routePaths(basePath, '/api/health-state'), (request, response) => {
    const payload = typeof request.body === 'object' && request.body !== null ? request.body : {}

    if (typeof payload.isUnhealthy !== 'boolean') {
      response.status(400).json({ error: 'isUnhealthy must be a boolean' })
      return
    }

    isUnhealthy = payload.isUnhealthy
    response.json({ isUnhealthy })
  })

  app.get(routePaths(basePath, '/health'), (_request, response) => {
    const payload = { timestamp: new Date().toISOString() }

    if (isInStartupDelay()) {
      response.status(500).json(payload)
      return
    }

    if (isUnhealthy) {
      response.status(503).json(payload)
      return
    }

    response.json(payload)
  })

  app.use(basePath, express.static(distDirectory, { index: false }))

  // Express 5 requires named wildcards; this catches all SPA routes.
  if (basePath === DEFAULT_BASE_PATH) {
    app.get('/{*path}', async (_request, response) => {
      await sendIndexHtml(response, basePath)
    })
  } else {
    app.get(basePath, async (_request, response) => {
      await sendIndexHtml(response, basePath)
    })
    app.get(`${basePath}/{*path}`, async (_request, response) => {
      await sendIndexHtml(response, basePath)
    })
  }

  return app
}

export function startServer({ port = Number(process.env.PORT ?? '80') } = {}) {
  const app = createApp()
  return app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Frontend server listening on ${port}`)
  })
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  startServer()
}
