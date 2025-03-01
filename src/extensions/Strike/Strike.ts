import type { StrikeOptions as TiptapStrikeOptions } from '@tiptap/extension-strike'
import { Strike as TiptapStrike } from '@tiptap/extension-strike'
import ActionButton from '@/components/ActionButton.vue'
import type { GeneralOptions } from '@/type'

export interface StrikeOptions extends TiptapStrikeOptions, GeneralOptions<StrikeOptions> { }

export const Strike = TiptapStrike.extend<StrikeOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.chain().toggleStrike().focus().run(),
          isActive: () => editor.isActive('strike') || false,
          disabled: !editor.isEditable || !editor.can().toggleStrike(),
          icon: 'Strikethrough',
          shortcutKeys: ['shift', 'mod', 'X'],
          tooltip: t('editor.strike.tooltip'),
        },
      }),
    }
  },
})
