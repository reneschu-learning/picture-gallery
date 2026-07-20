import { getBasePath, normalizeBasePath, withBasePath } from './basePath'

describe('basePath service', () => {
  afterEach(() => {
    delete window.__APP_BASE_PATH__
  })

  it('normalizes base path values', () => {
    expect(normalizeBasePath(undefined)).toBe('/')
    expect(normalizeBasePath('')).toBe('/')
    expect(normalizeBasePath('   ')).toBe('/')
    expect(normalizeBasePath('/')).toBe('/')
    expect(normalizeBasePath('v4')).toBe('/v4')
    expect(normalizeBasePath('/v5/')).toBe('/v5')
    expect(normalizeBasePath('///')).toBe('/')
  })

  it('reads and normalizes runtime base path from window', () => {
    window.__APP_BASE_PATH__ = '/v4/'
    expect(getBasePath()).toBe('/v4')
  })

  it('prefixes app URLs with runtime base path', () => {
    window.__APP_BASE_PATH__ = '/v4'

    expect(withBasePath('/api/runtime-config')).toBe('/v4/api/runtime-config')
    expect(withBasePath('api/visit-log')).toBe('/v4/api/visit-log')
  })
})