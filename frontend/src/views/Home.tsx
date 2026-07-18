import { useMemo } from 'react'
import GalleryGrid from '../features/gallery/GalleryGrid'
import { getRandomGalleryImages } from '../services/imageService'

function Home() {
  const images = useMemo(() => getRandomGalleryImages(5), [])

  return (
    <main className="content-panel" aria-labelledby="home-heading">
      <h2 id="home-heading" className="section-title">
        Home
      </h2>
      <GalleryGrid images={images} />
    </main>
  )
}

export default Home
