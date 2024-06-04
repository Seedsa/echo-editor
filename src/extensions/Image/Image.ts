import { Editor, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TiptapImage from '@tiptap/extension-image'
import ImageView from './components/ImageView.vue'
import ImageActionButton from './components/ImageActionButton.vue'
import { IMAGE_SIZE } from '@/constants'
import type { ImageAttrsOptions } from './types'

export const enum ImageDisplay {
  INLINE = 'inline',
  BREAK_TEXT = 'block',
  FLOAT_LEFT = 'left',
  FLOAT_RIGHT = 'right',
}

export const DEFAULT_IMAGE_WIDTH = 200
export const DEFAULT_IMAGE_DISPLAY = ImageDisplay.INLINE

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
export const Image = TiptapImage.extend({
  // https://github.com/ueberdosis/tiptap/issues/1206
  inline() {
    return true
  },

  group() {
    return 'inline'
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: IMAGE_SIZE['size-medium'],
        parseHTML: element => {
          const width = element.style.width || element.getAttribute('width') || null
          return width == null ? null : parseInt(width, 10)
        },
        renderHTML: attributes => {
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          const height = element.style.height || element.getAttribute('height') || null
          return height == null ? null : parseInt(height, 10)
        },
        renderHTML: attributes => {
          return {
            height: attributes.height,
          }
        },
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

  addOptions() {
    return {
      ...this.parent?.(),
      inline: true,
      upload: null,
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
  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(
        // Always render the `height="auto"
        {
          height: 'auto',
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ]
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },
})

export default Image
