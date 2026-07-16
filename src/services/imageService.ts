import type { GalleryImage } from '../types'

const IMAGE_SIZE = 720
const MIN_IMAGE_ID = 10
const MAX_IMAGE_ID = 1000
const DEFAULT_ALT = 'Picture from the gallery'

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function toGalleryImage(id: number): GalleryImage {
  return {
    id,
    src: `https://picsum.photos/id/${id}/${IMAGE_SIZE}/${IMAGE_SIZE}`,
    alt: `${DEFAULT_ALT} ${id}`,
  }
}

export function getRandomGalleryImages(count = 5): GalleryImage[] {
  if (count <= 0) {
    return []
  }

  const uniqueIds = new Set<number>()

  while (uniqueIds.size < count) {
    uniqueIds.add(getRandomInt(MIN_IMAGE_ID, MAX_IMAGE_ID))
  }

  return Array.from(uniqueIds, toGalleryImage)
}
