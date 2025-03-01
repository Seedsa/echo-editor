import type { BlockquoteOptions as TiptapBlockquoteOptions } from '@tiptap/extension-blockquote'
import { Blockquote as TiptapBlockquote } from '@tiptap/extension-blockquote'
import ActionButton from '@/components/ActionButton.vue'

import type { GeneralOptions } from '@/type'

export interface BlockquoteOptions extends TiptapBlockquoteOptions, GeneralOptions<BlockquoteOptions> { }

export const Blockquote = TiptapBlockquote.extend<BlockquoteOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'blockquote',
      },
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor?.chain().focus().toggleBlockquote().run(),
          isActive: () => editor.isActive('blockquote') || false,
          disabled: !editor?.isEditable || !editor.can().toggleBlockquote(),
          icon: 'TextQuote',
          shortcutKeys: ['shift', 'mod', 'B'],
          tooltip: t('editor.blockquote.tooltip'),
        },
      }),
    }
  },
})
