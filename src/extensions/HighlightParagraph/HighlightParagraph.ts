import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { Extension } from '@tiptap/core'

export const HighlightParagraphKey = new PluginKey('highlight-paragraph')

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    'highlight-paragraph': {
      /**
       * @description Set search term in extension.
       */
      setHighlightParagraph: (pos: any) => ReturnType
      /**
       * @description Set replace term in extension.
       */
      clearHighlightParagraph: () => ReturnType

    }
  }
}
export const HighlightParagraph = Extension.create({
  name: "highlight-paragraph",
  addCommands() {
    return {
      setHighlightParagraph:
        (pos: any) =>
          ({ editor }) => {
            editor.view.dispatch(editor.view.state.tr.setMeta(HighlightParagraphKey, pos))
            return false
          },
      clearHighlightParagraph:
        () =>
          ({ editor }) => {
            editor.view.dispatch(editor.view.state.tr.setMeta(HighlightParagraphKey, null))
            return false
          },

    }
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: HighlightParagraphKey,
        state: {
          init() {
            return DecorationSet.empty
          },
          apply(tr, old) {
            const highlightPos = tr.getMeta(HighlightParagraphKey)

            if (highlightPos === undefined) {
              return old.map(tr.mapping, tr.doc)
            }

            if (highlightPos === null) {
              return DecorationSet.empty
            }

            const node = tr.doc.nodeAt(highlightPos)
            if (!node) return DecorationSet.empty

            return DecorationSet.create(tr.doc, [
              Decoration.node(highlightPos, highlightPos + node.nodeSize, {
                class: 'highlight-paragraph'
              })
            ])
          }
        },
        props: {
          decorations(state) {
            return this.getState(state)
          }
        }
      })
    ]
  }
})

