const ROOT_PATH = '/'

export function normalizeBasePath(value: unknown): string {
  if (typeof value !== 'string') {
    return ROOT_PATH
  }

  const trimmed = value.trim()
  if (trimmed === '' || trimmed === ROOT_PATH) {
    return ROOT_PATH
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, '')
  return withoutTrailingSlash === '' ? ROOT_PATH : withoutTrailingSlash
}

export function getBasePath(): string {
  if (typeof window === 'undefined') {
    return ROOT_PATH
  }

  return normalizeBasePath(window.__APP_BASE_PATH__)
}

export function withBasePath(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const basePath = getBasePath()

  if (basePath === ROOT_PATH) {
    return normalizedPath
  }

  return `${basePath}${normalizedPath}`
}