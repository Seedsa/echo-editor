import { Node } from '@tiptap/core'
import { VueNodeViewRenderer, mergeAttributes } from '@tiptap/vue-3'
import AINodeView from './components/AiView.vue'
import ActionButton from '@/components/ActionButton.vue'
import { GeneralOptions } from '@/type'

export interface AIOptions extends GeneralOptions<AIOptions> {
  selectionFrom: number
  selectionTo: number
  selectionText: string
  selectionJSON: Record<string, any> | Array<Record<string, any>>
  HTMLAttributes: Record<string, any>
  completions: (text?: string) => void
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    magic: {
      activateMagic: () => ReturnType
    }
  }
}

export const AI = Node.create<AIOptions>({
  name: 'Ai',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      selectionFrom: {
        default: -1,
      },
      selectionTo: {
        default: -1,
      },
      selectionText: {
        default: '',
      },
      selectionJSON: {
        default: null,
      },
      prevText: {
        default: '',
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: `div.node-${this.name}`,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
  addNodeView() {
    return VueNodeViewRenderer(AINodeView)
  },
  addCommands() {
    return {
      activateMagic: () => props => {
        const { chain, state, tr } = props
        const selectionFrom = state.selection.from
        const selectionTo = state.selection.to
        const selectionText = state.doc.textBetween(selectionFrom, selectionTo)
        const selectionJSON = selectionText.length === 0 ? null : state.selection.content().content.toJSON()
        const prevText = state.doc.textBetween(Math.max(0, selectionTo - 5000), selectionTo, '\n')

        return chain()
          .setTextSelection({ from: selectionTo, to: selectionTo })
          .insertContent({
            type: this.name,
            attrs: {
              selectionFrom,
              selectionTo,
              selectionText,
              selectionJSON,
              prevText,
            },
          })
          .run()
      },
    }
  },
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: `node-${this.name}`,
      },
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => {
            editor.commands.activateMagic()
          },
          isActive: () => editor.isActive('bold') || false,
          disabled: !editor.can().toggleBold(),
          icon: 'Sparkles',
          tooltip: 'AI',
        },
      }),
    }
  },
})
