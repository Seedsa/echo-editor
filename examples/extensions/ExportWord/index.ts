import { Extension } from '@tiptap/core'
import { saveAs } from 'file-saver'
import ActionButton from './components/ActionButton.vue'
import { DocxSerializer, defaultNodes, defaultMarks } from 'prosemirror-docx'
import { Packer } from 'docx'
import type { GeneralOptions } from 'echo-editor'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    exportWord: {
      exportToWord: () => ReturnType
    }
  }
}
export interface ExportWordOptions extends GeneralOptions<ExportWordOptions> {}

const nodeSerializer = {
  ...defaultNodes,
  hardBreak: defaultNodes.hard_break,
  codeBlock: defaultNodes.code_block,
  orderedList: defaultNodes.ordered_list,
  listItem: defaultNodes.list_item,
  bulletList: defaultNodes.bullet_list,
  horizontalRule: defaultNodes.horizontal_rule,
  image(state, node) {
    // No image
    state.renderInline(node)
    state.closeBlock(node)
  },
}
const docxSerializer = new DocxSerializer(nodeSerializer, defaultMarks)

export const ExportWord = Extension.create<ExportWordOptions>({
  name: 'exportWord',
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({}) => ({
        component: ActionButton,
        componentProps: {},
      }),
    }
  },
  addCommands() {
    return {
      exportToWord:
        () =>
        ({ editor }) => {
          const opts: any = {
            getImageBuffer: async (src: string) => {
              const response = await fetch(src)
              const arrayBuffer = await response.arrayBuffer()
              return new Uint8Array(arrayBuffer)
            },
          }
          const wordDocument = docxSerializer.serialize(editor.state.doc, opts)
          Packer.toBlob(wordDocument).then(blob => saveAs(new Blob([blob]), 'example.docx'))
          return true
        },
    }
  },
})
