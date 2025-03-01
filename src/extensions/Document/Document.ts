import { Document as TiptapDocument } from '@tiptap/extension-document'

export const Document = TiptapDocument.extend({

  content() {
    const columnsNode = !!this.editor?.options.extensions.find((e) => e.name === 'columns')
    return columnsNode ? '(block|columns)+' : 'block+'
  }
})

export default Document
