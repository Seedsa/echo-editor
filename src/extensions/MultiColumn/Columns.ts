import { Node } from '@tiptap/core'
import { Column } from './Column'
import { GeneralOptions } from '@/type'

export enum ColumnLayout {
  TwoColumn = '2-column',
  ThreeColumn = '3-column',
  FourColumn = '4-column',
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      setColumns: (columnCount: number) => ReturnType
      setLayout: (layout: ColumnLayout) => ReturnType
    }
  }
}
export interface ColumnsOptions extends GeneralOptions<ColumnsOptions> {
  columnOptions: any
  HTMLAttributes: Record<string, any>
  layout: any
}

export const Columns = Node.create<ColumnsOptions>({
  name: 'columns',
  group: 'columns',
  content: 'column+',
  defining: true,
  isolating: true,
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {},
      layout: ColumnLayout.TwoColumn,
    }
  },

  addCommands() {
    return {
      setColumns:
        columnCount =>
        ({ commands }) => {
          let columnsHTML = ''
          for (let i = 0; i < columnCount; i++) {
            columnsHTML += `<div data-type="column"><p></p></div>`
          }
          this.options.layout = `${columnCount}-column`
          commands.insertContent(`<div data-type="columns">${columnsHTML}</div>`)
          return true
        },

      setLayout:
        (layout: ColumnLayout) =>
        ({ commands }) =>
          commands.updateAttributes('columns', { layout }),
    }
  },

  renderHTML() {
    return [
      'div',
      {
        'data-type': 'columns',
        class: `layout-${this.options.layout}`,
      },
      0,
    ]
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="columns"]',
      },
    ]
  },
  addExtensions() {
    return [Column.configure(this.options.columnOptions)]
  },
})

export default Columns
