import { getRandomGalleryImages } from './imageService'

describe('getRandomGalleryImages', () => {
  it('returns five unique square-friendly image records by default', () => {
    const images = getRandomGalleryImages()

    expect(images).toHaveLength(5)
    expect(new Set(images.map((image) => image.id)).size).toBe(5)

    for (const image of images) {
      expect(image.src).toContain('/720/720')
      expect(image.alt).toMatch(/picture from the gallery/i)
    }
  })
})
