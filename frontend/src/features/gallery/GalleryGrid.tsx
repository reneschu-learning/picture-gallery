import type { GalleryImage } from '../../types'
import ImageCard from './ImageCard'

interface GalleryGridProps {
  images: GalleryImage[]
}

function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <section className="gallery-section" aria-label="Picture grid">
      <div className="gallery-grid">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </section>
  )
}

export default GalleryGrid
