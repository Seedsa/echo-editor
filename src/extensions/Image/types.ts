/** Represents the key types for different image tabs */
export type ImageTabKey = 'url' | 'upload'

/** Represents the display options for images */
export type Display = 'block' | 'inline' | 'left' | 'right'

/** Represents an image tab with specified properties */
export interface ImageTab {
  /**
   * The name of the image tab
   */
  name: string
  /**
   * The type of the image tab key
   */
  type?: ImageTabKey
  /**
   * The component associated with the image tab
   */
  component: any
}

/**
 * Represents options for configuring image attributes
 */
export interface ImageAttrsOptions {
  /** The source URL of the image. */
  src?: string
  /** The alternative text for the image. */
  alt?: string
  /** The title of the image. */
  title?: string
  /** Indicates whether the aspect ratio of the image should be locked. */
  lockAspectRatio?: boolean
  /** The width of the image. */
  width?: number | string | null
  /** The height of the image. */
  height?: number | string | null
  /** The display style of the image. */
  display?: Display
}

/** Represents a form for handling image attributes */
export interface ImageForm extends ImageAttrsOptions {
  /** An array of File objects representing the image file */
  file?: File[]
}
