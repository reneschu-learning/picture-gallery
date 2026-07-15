import type { GalleryImage } from '../../types'

interface ImageCardProps {
  image: GalleryImage
}

function ImageCard({ image }: ImageCardProps) {
  return (
    <figure className="image-card">
      <img className="gallery-image" src={image.src} alt={image.alt || 'Gallery image'} loading="lazy" />
    </figure>
  )
}

export default ImageCard
