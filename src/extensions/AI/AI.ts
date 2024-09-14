import { Node } from '@tiptap/core'
import ActionButton from './AIButton.vue'
import { GeneralOptions } from '@/type'

export interface AIOptions extends GeneralOptions<AIOptions> {
  completions: (prompt: string, text: string, signal?: AbortSignal) => Promise<any>
}

export const AI = Node.create<AIOptions>({
  name: 'AI',
  group: 'block',
  addOptions() {
    return {
      ...this.parent?.(),
      toolbar: false,
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          icon: 'Sparkles',
          tooltip: t('editor.AI.ask'),
        },
      }),
    }
  },
})
