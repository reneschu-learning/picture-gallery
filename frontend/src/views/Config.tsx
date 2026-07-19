import { getRuntimeConfig } from '../services/runtimeConfig'
import type { RuntimeConfigFileContent } from '../types'

function formatConfigValue(value: string | RuntimeConfigFileContent): string {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
}

function Config() {
  const config = getRuntimeConfig()

  return (
    <main className="content-panel" aria-labelledby="config-heading">
      <h2 id="config-heading" className="section-title">
        Config
      </h2>
      <dl className="about-list">
        <div className="about-row">
          <dt>CONFIG_VAR1</dt>
          <dd>
            <pre className="config-value">{formatConfigValue(config.CONFIG_VAR1)}</pre>
          </dd>
        </div>
        <div className="about-row">
          <dt>SECRET1</dt>
          <dd>
            <pre className="config-value">{formatConfigValue(config.SECRET1)}</pre>
          </dd>
        </div>
        <div className="about-row">
          <dt>CONFIG_FILE</dt>
          <dd>
            <pre className="config-value">{formatConfigValue(config.CONFIG_FILE)}</pre>
          </dd>
        </div>
        <div className="about-row">
          <dt>CONFIG_FILE content</dt>
          <dd>
            <pre className="config-value">{formatConfigValue(config.CONFIG_FILE_CONTENT)}</pre>
          </dd>
        </div>
        <div className="about-row">
          <dt>CONFIG_FILE_VOL</dt>
          <dd>
            <pre className="config-value">{formatConfigValue(config.CONFIG_FILE_VOL)}</pre>
          </dd>
        </div>
        <div className="about-row">
          <dt>CONFIG_FILE_VOL content</dt>
          <dd>
            <pre className="config-value">{formatConfigValue(config.CONFIG_FILE_VOL_CONTENT)}</pre>
          </dd>
        </div>
      </dl>
    </main>
  )
}

export default Config
