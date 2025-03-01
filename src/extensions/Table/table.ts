import TiptapTable from '@tiptap/extension-table'

import { TableRow } from '@tiptap/extension-table-row'
import type { TableRowOptions } from '@tiptap/extension-table-row'

import { TableCell } from '@tiptap/extension-table-cell'
import type { TableCellOptions } from '@tiptap/extension-table-cell'

import { TableHeader } from '@tiptap/extension-table-header'
import type { TableHeaderOptions } from '@tiptap/extension-table-header'

import { TableCellBackground } from './cell-background'
import type { TableCellBackgroundOptions } from './cell-background'

import { GeneralOptions } from '@/type'
import TableActionButton from './components/TableActionButton.vue'

export interface TableOptions extends GeneralOptions<TableOptions> {
  HTMLAttributes: Record<string, any>
  resizable: boolean
  handleWidth: number
  cellMinWidth: number
  lastColumnResizable: boolean
  allowTableNodeSelection: boolean
  /** options for table rows */
  tableRow: Partial<TableRowOptions>
  /** options for table headers */
  tableHeader: Partial<TableHeaderOptions>
  /** options for table cells */
  tableCell: Partial<TableCellOptions>
  /** options for table cell background */
  tableCellBackground: Partial<TableCellBackgroundOptions>
}
export const Table = TiptapTable.extend<TableOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      resizable: true,
      lastColumnResizable: true,
      allowTableNodeSelection: false,
      button: ({ editor, t }) => ({
        component: TableActionButton,
        componentProps: {
          disabled: !editor.isEditable || editor.isActive('table') || false,
          icon: 'Table',
          tooltip: t('editor.table.tooltip'),
        },
      }),
    }
  },

  addExtensions() {
    return [
      TableRow.configure(this.options.tableRow),
      TableHeader.configure(this.options.tableHeader),
      TableCell.configure(this.options.tableCell),
      TableCellBackground.configure(this.options.tableCellBackground),
    ]
  },
})

export default Table
