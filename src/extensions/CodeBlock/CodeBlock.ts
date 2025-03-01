import ActionButton from '@/components/ActionButton.vue'
import { CodeBlockLowlight as TiptapCodeBlock } from '@tiptap/extension-code-block-lowlight'
import type { CodeBlockLowlightOptions as TiptapCodeBlockOptions } from '@tiptap/extension-code-block-lowlight'
import type { GeneralOptions } from '@/type'
import CodeBlockView from './components/CodeBlockView.vue'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
export interface CodeBlockOptions extends TiptapCodeBlockOptions, GeneralOptions<CodeBlockOptions> { }

export const CodeBlock = TiptapCodeBlock.extend<CodeBlockOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      language: 'auto',
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor?.chain().focus().toggleCodeBlock().run(),
          isActive: () => editor.isActive('codeBlock') || false,
          disabled: !editor?.isEditable || !editor.can().toggleCodeBlock(),
          icon: 'Code2',
          tooltip: t('editor.codeblock.tooltip'),
        },
      }),
    }
  },
  addNodeView() {
    return VueNodeViewRenderer(CodeBlockView)
  },
})
