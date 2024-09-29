import { Extension } from '@tiptap/core'
import { useToast } from '@/components/ui/toast/use-toast'
import { hasExtension } from '@/utils/utils'

import ActionButton from '@/components/ActionButton.vue'
import type { GeneralOptions } from '@/type'
import { useLocale } from '@/locales'
import { base64ToBlob, blobToFile } from './utils'

export interface ImportWordOptions extends GeneralOptions<ImportWordOptions> {
  /**
   * Function for custom wort to html
   */
  convert?: (file: File) => Promise<string>

  /** Function for uploading images */
  upload?: (files: File[]) => Promise<unknown>

  /**
   * File Size limit
   *
   * @default 1024 * 1024 * 10
   */
  limit: number
}
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    importWord: {
      /**
       * toggle import from word
       */
      toggleImportWord: () => ReturnType
    }
  }
}

export const ImportWord = Extension.create<ImportWordOptions>({
  name: 'importWord',
  addOptions() {
    return {
      ...this.parent?.(),
      upload: undefined,
      convert: undefined,
      limit: 1024 * 1024 * 10, //10MB
      button: ({ editor, extension, t }) => {
        return {
          component: ActionButton,
          componentProps: {
            action: () => editor.commands?.toggleImportWord(),
            disabled: !editor.can().setHorizontalRule(),
            icon: 'Word',
            tooltip: t('editor.importWord.tooltip'),
          },
        }
      },
    }
  },
  addCommands() {
    return {
      toggleImportWord:
        () =>
        ({ chain, editor }) => {
          const { toast } = useToast()
          const { t } = useLocale()
          async function filerImage(html: string) {
            const parser = new DOMParser()
            const doc = parser.parseFromString(html, 'text/html')
            const images = doc.querySelectorAll('img')
            if (!images.length) {
              return doc.body.innerHTML
            }
            const hasImage = hasExtension(editor, 'image')
            if (hasImage) {
              const uploadOptions = editor.extensionManager.extensions.find(
                extension => extension.name === 'importWord'
              )?.options
              if (uploadOptions && typeof uploadOptions.upload === 'function') {
                const files: File[] = []
                // convert base64 image to blob file
                for (let img of images) {
                  const originalSrc = img.getAttribute('src')
                  const blob = base64ToBlob(originalSrc, 'image/jpeg')
                  const file = blobToFile(blob, 'image.jpeg')
                  files.push(file)
                }
                const uploadRes = await uploadOptions.upload(files)
                // 批量设置images
                for (let i = 0; i < images.length; i++) {
                  const img = images[i]
                  img.setAttribute('src', uploadRes[i].src)
                  const parent = img.parentElement
                  if (parent?.tagName === 'P') {
                    parent.insertAdjacentElement('beforebegin', img)
                    if (!parent.hasChildNodes() && parent.textContent === '') {
                      parent.remove()
                    }
                  }
                }
                return doc.body.innerHTML
              } else {
                console.warn('Image Upload method found, skip image conversion')
                return doc.body.innerHTML
              }
            } else {
              console.error('Image extension not found, unable to convert image')
              return doc.body.innerHTML
            }
          }
          async function handleResult(htmlResult: string) {
            const html = await filerImage(htmlResult)
            editor.chain().setContent(html.toString(), true).run()
            toast({
              title: t.value('editor.importWord.success'),
            })
          }
          const { open, onChange } = useFileDialog({
            accept: '.docx',
            reset: true,
            multiple: false,
          })
          open()
          onChange(async (files: FileList | null) => {
            const [file] = Array.from(files ?? [])
            if (!file) {
              return
            }
            if (file.size > this.options.limit) {
              toast({
                title: t.value('editor.importWord.fileTooLarge'),
                variant: 'destructive',
              })
              return
            }
            if (this.options.convert) {
              const result = await this.options.convert(file)
              handleResult(result)
            } else {
              const formData = new FormData()
              const config = JSON.stringify({
                collaboration_features: {
                  comments: true,
                  user_id: 'e3',
                  track_changes: true,
                },
                formatting: {
                  resets: 'none',
                  defaults: 'inline',
                  styles: 'inline',
                  comments: 'basic',
                },
              })
              formData.append('config', config)
              formData.append('file', file)
              // or use Mammoth.js
              fetch('https://docx-converter.cke-cs.com/v2/convert/docx-html', {
                method: 'POST',
                body: formData,
              })
                .then(response => response.json())
                .then(async data => {
                  handleResult(data.html)
                })
                .catch(error => {
                  toast({
                    title: t.value('editor.importWord.error'),
                    variant: 'destructive',
                  })
                  console.error('Error:', error)
                })
            }
          })
          return false
        },
    }
  },
})
