import { HistoryOptions as TiptapHistoryOptions, History as TiptapHistory } from "@tiptap/extensions";

import ActionButton from '@/components/ActionButton.vue'

import type { GeneralOptions } from '@/type'

export interface HistoryOptions extends TiptapHistoryOptions, GeneralOptions<HistoryOptions> { }

export const History = TiptapHistory.extend<HistoryOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      depth: 10,
      button: ({ editor, t }) => {
        const historys: ['undo', 'redo'] = ['undo', 'redo']
        return historys.map(item => ({
          component: ActionButton,
          componentProps: {
            action: () => {
              if (item === 'undo') editor?.chain().undo().focus().run()
              if (item === 'redo') editor?.chain().redo().focus().run()
            },
            shortcutKeys: item === 'undo' ? ['mod', 'Z'] : ['shift', 'mod', 'Z'],
            disabled: !editor?.isEditable || !editor.can()[item](),
            icon: item === 'undo' ? 'Undo2' : 'Redo2',
            tooltip: t(`editor.${item}.tooltip`),
          },
        }))
      },
    }
  },
})
