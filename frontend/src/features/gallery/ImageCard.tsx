import type { GalleryImage } from '../../types'

interface ImageCardProps {
  image: GalleryImage
}

function ImageCard({ image }: ImageCardProps) {
  // Generate random rotation between -15 and +15 degrees
  const rotation = Math.random() * 30 - 15

  return (
    <figure className="image-card" style={{ '--image-rotation': `${rotation}deg` } as React.CSSProperties}>
      <img className="gallery-image" src={image.src} alt={image.alt || 'Gallery image'} loading="lazy" />
    </figure>
  )
}

export default ImageCard
