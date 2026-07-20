import type { AboutInfo } from '../types'

const aboutInfo: AboutInfo = {
  purpose: 'Demo application',
  author: 'Microsoft',
  version: '2.3.0',
}

function About() {
  return (
    <main className="content-panel" aria-labelledby="about-heading">
      <h2 id="about-heading" className="section-title">
        About
      </h2>
      <dl className="about-list">
        <div className="about-row">
          <dt>Purpose</dt>
          <dd>{aboutInfo.purpose}</dd>
        </div>
        <div className="about-row">
          <dt>Author</dt>
          <dd>{aboutInfo.author}</dd>
        </div>
        <div className="about-row">
          <dt>Version</dt>
          <dd>{aboutInfo.version}</dd>
        </div>
      </dl>
    </main>
  )
}

export default About
