import ActionButton from '@/components/ActionButton.vue'
import { CodeBlockLowlight as TiptapCodeBlock } from '@tiptap/extension-code-block-lowlight'
import type { CodeBlockLowlightOptions as TiptapCodeBlockOptions } from '@tiptap/extension-code-block-lowlight'
import type { GeneralOptions } from '@/type'

export interface CodeBlockOptions extends TiptapCodeBlockOptions, GeneralOptions<CodeBlockOptions> {}

export const CodeBlock = TiptapCodeBlock.extend<CodeBlockOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      defaultLanguage: null,
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.commands.toggleCodeBlock(),
          isActive: () => editor.isActive('codeBlock') || false,
          disabled: !editor.can().toggleCodeBlock(),
          icon: 'Code2',
          tooltip: t('editor.codeblock.tooltip'),
        },
      }),
    }
  },
})
