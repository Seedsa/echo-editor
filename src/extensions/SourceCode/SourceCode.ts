import { Extension } from '@tiptap/core'
import ActionButton from '@/components/ActionButton.vue'
import type { GeneralOptions } from '@/type'
import { useTiptapStore } from '@/hooks'
const store = useTiptapStore()

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    sourceCode: {
      toggleSourceCode: () => ReturnType
      insertSourceCode: (char: string) => ReturnType
    }
  }
}
export interface SourceCodeOptions extends GeneralOptions<SourceCodeOptions> { }

export const SourceCode = Extension.create<SourceCodeOptions>({
  name: 'sourceCode',
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ t }) => ({
        component: ActionButton,
        componentProps: {
          icon: 'CodeXml',
          action: () => {
            store.toggleSourceCode()
          },
          tooltip: t('editor.sourceCode.tooltip'),
          isActive: () => store.state.sourceCode
        },
      }),
    }
  },
  addCommands() {
    return {
      toggleSourceCode:
        () =>
          ({ editor }) => {
            store.toggleSourceCode()
            return true
          },
    }
  },
})
