import type { CodeOptions as TiptapCodeOptions } from '@tiptap/extension-code'
import { Code as TiptapCode } from '@tiptap/extension-code'

import ActionButton from '@/components/ActionButton.vue'

import type { GeneralOptions } from '@/type'

export interface CodeOptions extends TiptapCodeOptions, GeneralOptions<CodeOptions> { }

export const Code = TiptapCode.extend<CodeOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      toolbar: false,
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor?.chain().focus().toggleCode().run(),
          isActive: () => editor.isActive('code') || false,
          disabled: !editor?.isEditable || !editor.can().toggleCode(),
          icon: 'Code',
          shortcutKeys: ['mod', 'E'],
          tooltip: t('editor.code.tooltip'),
        },
      }),
    }
  },
})
