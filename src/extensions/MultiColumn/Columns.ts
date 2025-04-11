import { Node } from '@tiptap/core'
import { Column } from './Column'
import { GeneralOptions } from '@/type'

export enum ColumnLayout {
  SidebarLeft = 'sidebar-left',
  SidebarRight = 'sidebar-right',
  TwoColumn = 'two-column',
  ThreeColumn = 'three-column',
  FourColumn = 'four-column',
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      setColumns: () => ReturnType
      setThreeColumns: () => ReturnType
      setFourColumns: () => ReturnType
      setLayout: (layout: ColumnLayout) => ReturnType
    }
  }
}
export interface ColumnsOptions extends GeneralOptions<ColumnsOptions> {
  columnOptions: any
  layout: ColumnLayout
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
      layout: ColumnLayout.TwoColumn,
    }
  },

  addAttributes() {
    return {
      layout: {
        default: ColumnLayout.TwoColumn,
      },
    }
  },
  addCommands() {
    return {
      setColumns:
        () =>
          ({ commands }) => {
            commands.insertContent(
              `<div data-type="columns"><div data-type="column" data-position="left"><p></p></div><div data-type="column" data-position="right"><p></p></div></div>`
            )
            return true
          },
      setThreeColumns:
        () =>
          ({ commands }) => {
            commands.insertContent(
              `<div data-type="columns" data-layout="three-column"><div data-type="column" data-position="left"><p></p></div><div data-type="column" data-position="middle"><p></p></div><div data-type="column" data-position="right"><p></p></div></div>`
            )
            return true
          },
      setFourColumns:
        () =>
          ({ commands }) => {
            commands.insertContent(
              `<div data-type="columns" data-layout="four-column"><div data-type="column" data-position="first"><p></p></div><div data-type="column" data-position="second"><p></p></div><div data-type="column" data-position="third"><p></p></div><div data-type="column" data-position="fourth"><p></p></div></div>`
            )
            return true
          },

      setLayout:
        (layout: ColumnLayout) =>
          ({ commands }) =>
            commands.updateAttributes('columns', { layout }),
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'columns', class: `layout-${HTMLAttributes.layout}` }, 0]
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="columns"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return {}
          const layout = element.getAttribute('data-layout')
          return layout ? { layout } : {}
        },
      },
    ]
  },
  addExtensions() {
    return [Column.configure(this.options.columnOptions)]
  },
})

export default Columns
