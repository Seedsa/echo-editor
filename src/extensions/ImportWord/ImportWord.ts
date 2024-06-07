import { Extension } from '@tiptap/core'

import ActionButton from './components/ImportWordButton.vue'
import type { GeneralOptions } from '@/type'

export interface ImportWordOptions extends GeneralOptions<ImportWordOptions> {
  /**
   * 将word 转换成html的接口
   */
  convert?: (file: File) => Promise<string>

  /** Function for uploading images */
  upload?: (files: File[]) => Promise<unknown>
}

export const ImportWord = Extension.create<ImportWordOptions>({
  name: 'importWord',
  addOptions() {
    return {
      ...this.parent?.(),
      upload: undefined,
      convert: undefined,
      button: ({ editor, extension, t }) => {
        const { convert } = extension.options
        return {
          component: ActionButton,
          componentProps: {
            convert,
            action: () => editor.commands.setHorizontalRule(),
            disabled: !editor.can().setHorizontalRule(),
            icon: 'Word',
            shortcutKeys: ['alt', 'mod', 'S'],
            tooltip: t('editor.importWrod.tooltip'),
          },
        }
      },
    }
  },
})
