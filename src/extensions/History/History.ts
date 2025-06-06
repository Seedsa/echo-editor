import type { UndoRedoOptions as TipTapUndoRedoOptions } from '@tiptap/extensions'
import { UndoRedo as TiptapUndoRedo } from "@tiptap/extensions";

import ActionButton from '@/components/ActionButton.vue'
import type { GeneralOptions } from '@/type'

export interface UndoRedoOptions extends TipTapUndoRedoOptions, GeneralOptions<UndoRedoOptions> { }

export const History = TiptapUndoRedo.extend<UndoRedoOptions>({
  addOptions() {
    return {
      ...this.parent!(),
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
