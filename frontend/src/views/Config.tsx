import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  DEFAULT_FRONTEND_HEALTH_STATE,
  getFrontendHealthState,
  setFrontendHealthState,
} from '../services/healthStateService'
import { DEFAULT_CONFIG, getRuntimeConfig } from '../services/runtimeConfig'
import type { RuntimeConfig } from '../types'
import type { RuntimeConfigFileContent } from '../types'

function formatConfigValue(value: string | RuntimeConfigFileContent): string {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
}

function Config() {
  const [config, setConfig] = useState<RuntimeConfig>(DEFAULT_CONFIG)
  const [isUnhealthy, setIsUnhealthy] = useState<boolean>(DEFAULT_FRONTEND_HEALTH_STATE.isUnhealthy)
  const [isUpdatingHealthState, setIsUpdatingHealthState] = useState<boolean>(false)
  const [healthStateError, setHealthStateError] = useState<string>('')

  useEffect(() => {
    let isMounted = true

    void Promise.all([getRuntimeConfig(), getFrontendHealthState()]).then(
      ([nextConfig, nextHealthState]) => {
        if (isMounted) {
          setConfig(nextConfig)
          setIsUnhealthy(nextHealthState.isUnhealthy)
        }
      },
    )

    return () => {
      isMounted = false
    }
  }, [])

  async function onHealthToggleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.checked
    setIsUpdatingHealthState(true)
    setHealthStateError('')

    const nextHealthState = await setFrontendHealthState(nextValue)

    if (!nextHealthState) {
      setHealthStateError('Could not update frontend health mode. Please retry.')
      setIsUpdatingHealthState(false)
      return
    }

    setIsUnhealthy(nextHealthState.isUnhealthy)
    setIsUpdatingHealthState(false)
  }

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
        <div className="about-row">
          <dt>BACKEND_SERVICE</dt>
          <dd>
            <pre className="config-value">{formatConfigValue(config.BACKEND_SERVICE)}</pre>
          </dd>
        </div>
        <div className="about-row">
          <dt>Frontend health mode</dt>
          <dd>
            <label className="toggle-control">
              <input
                type="checkbox"
                checked={isUnhealthy}
                onChange={onHealthToggleChange}
                disabled={isUpdatingHealthState}
                aria-label="Set frontend health endpoint to unhealthy"
              />
              Return 503 from /health
            </label>
            <p className="health-state-text">
              {isUnhealthy
                ? 'Frontend health is unhealthy (HTTP 503).'
                : 'Frontend health is healthy (HTTP 200).'}
            </p>
            {healthStateError.length > 0 ? (
              <p role="alert" className="health-state-error">
                {healthStateError}
              </p>
            ) : null}
          </dd>
        </div>
      </dl>
    </main>
  )
}

export default Config
