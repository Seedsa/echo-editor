import { Node, VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageUploaderView from './components/ImageUploader.vue'
import { useLocale } from '@/locales'
import { Plugin } from '@tiptap/pm/state'
import ActionButton from '@/components/ActionButton.vue'
import { UploadImagesPlugin, createImageUpload, handleImagePaste, handleImageDrop } from '@/plugins/image-upload'
import { useToast } from '@/components/ui/toast/use-toast'
export interface ImageOptions {
  /** function for uploading images */
  upload: (file: File) => Promise<unknown>
  /** accept image mimes */
  acceptMimes: string[]
  /** accept image max size */
  maxSize: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      setImageUpload: () => ReturnType
    }
  }
}

export const ImageUpload = Node.create<ImageOptions>({
  name: 'imageUpload',
  isolating: true,
  defining: true,
  group: 'block',
  draggable: false,
  selectable: true,
  inline: false,
  onCreate() {
    if (typeof this.options.upload !== 'function') {
      console.warn('image upload upload function should be a function')
      return
    }
  },
  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ]
  },
  renderHTML() {
    return ['div', { 'data-type': this.name }]
  },

  addCommands() {
    return {
      setImageUpload:
        () =>
        ({ commands }) =>
          commands.insertContent(`<div data-type="${this.name}"></div>`),
    }
  },
  addNodeView() {
    return VueNodeViewRenderer(ImageUploaderView)
  },
  addOptions() {
    return {
      ...this.parent?.(),
      acceptMimes: ['image/jpeg', 'image/gif', 'image/png', 'image/jpg'],
      maxSize: 1024 * 1024 * 1, // 10MB
      upload: () => Promise.reject('Image Upload Function'),
      button: ({ editor, extension, t }) => {
        const { upload } = extension.options
        return {
          component: ActionButton,
          componentProps: {
            action: () => editor.commands.setImageUpload(),
            upload,
            disabled: !editor.can().setImage({}),
            icon: 'ImageUp',
            tooltip: t('editor.image.tooltip'),
          },
        }
      },
    }
  },
  addProseMirrorPlugins() {
    const { toast } = useToast()
    const { t } = useLocale()

    const uploadFn = createImageUpload({
      validateFn: file => {
        console.log(file.type)
        if (!this.options.acceptMimes.includes(file.type)) {
          toast({
            description: t.value('editor.imageUpload.fileTypeNotSupported'),
            duration: 2000,
          })
          return false
        }
        if (file.size > this.options.maxSize) {
          toast({
            // 将当前文件大小转换为 KB
            description: `${t.value('editor.imageUpload.fileSizeTooBig')} ${this.options.maxSize / 1024 / 1024}MB.`,
            duration: 2000,
          })
          return false
        }
        return true
      },
      onUpload: this.options.upload,
    })

    return [
      new Plugin({
        props: {
          /**
           * 允许黏贴图片
           * @param _
           * @param event
           * @returns
           */
          handlePaste: (view, event) => {
            if (!event.clipboardData) {
              return false
            }
            const items = Array.from(event.clipboardData?.items || [])
            /// Clipboard may contain both html and image items (like when pasting from ms word, excel)
            /// in that case (if there is any html), don't handle images.
            if (items.some(x => x.type === 'text/html')) {
              return false
            }

            return handleImagePaste(view, event, uploadFn)
          },
          /**
           * 允许拖拽图片
           * @param _
           * @param event
           * @returns
           */
          handleDrop: (view, event, _, moved) => {
            if (!(event instanceof DragEvent) || !event.dataTransfer) {
              return false
            }
            handleImageDrop(view, event, moved, uploadFn)
            return false
          },
        },
      }),
      UploadImagesPlugin(),
    ]
  },
})

export default ImageUpload
