import { getRuntimeConfig } from '../services/runtimeConfig'

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
          <dd>{config.CONFIG_VAR1}</dd>
        </div>
        <div className="about-row">
          <dt>SECRET1</dt>
          <dd>{config.SECRET1}</dd>
        </div>
        <div className="about-row">
          <dt>CONFIG_FILE</dt>
          <dd>{config.CONFIG_FILE}</dd>
        </div>
        <div className="about-row">
          <dt>CONFIG_FILE content</dt>
          <dd>{config.CONFIG_FILE_CONTENT}</dd>
        </div>
        <div className="about-row">
          <dt>CONFIG_FILE_VOL</dt>
          <dd>{config.CONFIG_FILE_VOL}</dd>
        </div>
        <div className="about-row">
          <dt>CONFIG_FILE_VOL content</dt>
          <dd>{config.CONFIG_FILE_VOL_CONTENT}</dd>
        </div>
      </dl>
    </main>
  )
}

export default Config
