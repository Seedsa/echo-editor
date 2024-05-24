import type { ImageOptions as TiptapImageOptions } from '@tiptap/extension-image'
import { Image as TiptapImage } from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageView from './components/ImageView.vue'
import { insertImages, ImageNodeAttributes } from '@/utils/image'

import type { ImageAttrsOptions, ImageTab, ImageTabKey } from './types'
import { IMAGE_SIZE } from '@/constants'
import type { GeneralOptions } from '@/type'

/**
 * Represents the interface for image options, extending TiptapImageOptions and GeneralOptions.
 */
export interface ImageOptions extends TiptapImageOptions, GeneralOptions<ImageOptions> {
  /** Function for uploading images */
  upload?: (files: File[]) => ImageNodeAttributes[] | Promise<ImageNodeAttributes[]>
  /** List of image tabs */
  imageTabs: ImageTab[]
  /** List of hidden image tab keys */
  hiddenTabs: ImageTabKey[]
  /** Component for the image dialog */
  dialogComponent: any
}

/**
 * Represents the interface for options to set image attributes, extending ImageAttrsOptions and including the src property.
 */
interface SetImageAttrsOptions extends ImageAttrsOptions {
  /** The source URL of the image. */
  src: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageResize: {
      /**
       * Add an image
       */
      setImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
      /**
       * Update an image
       */
      updateImage: (options: Partial<SetImageAttrsOptions>) => ReturnType
    }
  }
}

export const Image = TiptapImage.extend<ImageOptions>({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: undefined,
      },
      lockAspectRatio: {
        default: true,
      },
      width: {
        default: IMAGE_SIZE['size-medium'],
      },
      height: {
        default: null,
      },
      display: {
        default: 'inline',
        renderHTML: ({ display }) => {
          if (!display) {
            return {}
          }
          return {
            'data-display': display,
          }
        },
        parseHTML: element => {
          const display = element.getAttribute('data-display')
          return display || 'inline'
        },
      },
    }
  },
  addNodeView() {
    return VueNodeViewRenderer(ImageView)
  },
  addCommands() {
    return {
      ...this.parent?.(),
      updateImage:
        options =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options)
        },
    }
  },
  addOptions() {
    return {
      ...this.parent?.(),
      upload: undefined,
      imageTabs: [],
      hiddenTabs: [],
      inline: true,
    }
  },
})
