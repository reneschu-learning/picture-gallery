import { withBasePath } from './basePath'

interface PageVisitPayload {
  page: string
  userAgent: string
  timestamp: string
}

function createPayload(page: string): PageVisitPayload {
  return {
    page,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  }
}

export async function sendPageVisitLog(page: string): Promise<void> {
  try {
    await fetch(withBasePath('/api/visit-log'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload(page)),
    })
  } catch {
    // Intentionally ignored: page logging must never break UX.
  }
}
