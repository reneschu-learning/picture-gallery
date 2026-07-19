export interface GalleryImage {
  id: number
  src: string
  alt: string
}

export interface AboutInfo {
  purpose: string
  author: string
  version: string
}

export interface RuntimeConfig {
  CONFIG_VAR1: string
  SECRET1: string
  CONFIG_FILE: string
  CONFIG_FILE_CONTENT: string
  CONFIG_FILE_VOL: string
  CONFIG_FILE_VOL_CONTENT: string
}
