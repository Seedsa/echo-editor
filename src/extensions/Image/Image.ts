import type { ImageOptions as TiptapImageOptions } from '@tiptap/extension-image'
import { Image as TiptapImage } from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { Plugin } from '@tiptap/pm/state'
import ImageView from './components/ImageView.vue'
import { insertImages, ImageNodeAttributes } from '@/utils/image'

import type { ImageAttrsOptions, ImageTab, ImageTabKey } from './types'
import ImageActionButton from './components/ImageActionButton.vue'
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
  group: 'block',
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
        default: '100%',
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
      button: ({ editor, extension, t }) => {
        const { upload, imageTabs, hiddenTabs } = extension.options
        return {
          component: ImageActionButton,
          componentProps: {
            editor,
            upload,
            imageTabs,
            hiddenTabs,
            isActive: () => editor.isActive('image') || false,
            disabled: !editor.can().setImage({}),
            icon: 'ImageUp',
            tooltip: t('editor.image.tooltip'),
          },
        }
      },
    }
  },
  addProseMirrorPlugins() {
    const options = this.options
    function fileListToImageFiles(fileList: FileList): File[] {
      return Array.from(fileList).filter(file => {
        const mimeType = (file.type || '').toLowerCase()
        return mimeType.startsWith('image/')
      })
    }
    const handleNewImageFiles = (files: File[], insertPosition?: number): void => {
      if (!this.editor) {
        return
      }
      // 改成使用上传接口
      if (options.upload && typeof options.upload === 'function') {
        const imageAttributes = options.upload(files)
        if (imageAttributes instanceof Promise) {
          imageAttributes.then(attributes => {
            insertImages({
              images: attributes,
              editor: this.editor,
              position: insertPosition,
            })
          })
        } else {
          insertImages({
            images: imageAttributes,
            editor: this.editor,
            position: insertPosition,
          })
        }
        return
      } else {
        // 只是简单的转换成 base64 TODO 上传到服务器
        const attributesForImageFiles = files.map(file => ({
          src: URL.createObjectURL(file),
          alt: file.name,
        }))
        insertImages({
          images: attributesForImageFiles,
          editor: this.editor,
          position: insertPosition,
        })
      }
    }
    return [
      new Plugin({
        props: {
          /**
           * 允许黏贴图片
           * @param _
           * @param event
           * @returns
           */
          handlePaste: (_, event) => {
            if (!event.clipboardData) {
              return false
            }
            const pastedImageFiles = fileListToImageFiles(event.clipboardData.files)
            if (pastedImageFiles.length > 0) {
              handleNewImageFiles(pastedImageFiles)
              return true
            }
            return false
          },
          /**
           * 允许拖拽图片
           * @param _
           * @param event
           * @returns
           */
          handleDrop: (view, event) => {
            if (!(event instanceof DragEvent) || !event.dataTransfer) {
              return false
            }
            const imageFiles = fileListToImageFiles(event.dataTransfer.files)
            if (imageFiles.length > 0) {
              // Insert the image at the drop position.
              const insertPosition = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              })?.pos
              handleNewImageFiles(imageFiles, insertPosition)
              event.preventDefault()
              return true
            }
            return false
          },
        },
      }),
    ]
  },
})
