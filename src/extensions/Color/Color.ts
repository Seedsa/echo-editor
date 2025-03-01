import { Editor } from '@tiptap/core'
import TiptapColor from '@tiptap/extension-color'
import type { ColorOptions as TiptapColorOptions } from '@tiptap/extension-color'
import ColorActionButton from './components/ColorActionButton.vue'

import type { GeneralOptions } from '@/type'

export interface ColorOptions extends TiptapColorOptions, GeneralOptions<ColorOptions> { }

export const Color = TiptapColor.extend<ColorOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }) {
        return {
          component: ColorActionButton,
          componentProps: {
            action: (color?: unknown) => {
              if (typeof color === 'undefined') editor.chain().focus().unsetColor().run()
              if (typeof color === 'string') editor.chain().focus().setColor(color).run()
            },
            isActive: () => {
              const { color } = editor.getAttributes('textStyle')
              if (!color) return false
              return editor.isActive({ color }) || false
            },
            editor,
            disabled: !editor?.isEditable || !editor.can().setColor(''),
            tooltip: t('editor.color.tooltip'),
          },
        }
      },
    }
  },
})
