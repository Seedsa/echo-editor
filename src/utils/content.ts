import type { Editor } from '@tiptap/core'

export function getSelectionText(editor: Editor): string {
  const { from, to, empty } = editor.state.selection
  if (empty) {
    return ''
  }
  return editor.state.doc.textBetween(from, to, '')
}
