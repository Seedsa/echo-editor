<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu, isActive } from '@tiptap/vue-3'
import { useLocale } from '@/locales'
import ActionButton from '@/components/ActionButton.vue'
import { sticky } from 'tippy.js'
import type { GetReferenceClientRect } from 'tippy.js'
import HighlightActionButton from '@/extensions/Highlight/components/HighlightActionButton.vue'
import { Separator } from '@/components/ui/separator'

interface Props {
  editor: Editor
}
const props = withDefaults(defineProps<Props>(), {})

const shouldShow = ({ editor }) => {
  return isActive(editor.view.state, 'table')
}
const { t } = useLocale()

function onAddColumnBefore() {
  props.editor.chain().focus().addColumnBefore().run()
}

function onAddColumnAfter() {
  props.editor.chain().focus().addColumnAfter().run()
}

function onDeleteColumn() {
  props.editor.chain().focus().deleteColumn().run()
}
function onAddRowAbove() {
  props.editor.chain().focus().addRowBefore().run()
}

function onAddRowBelow() {
  props.editor.chain().focus().addRowAfter().run()
}

function onDeleteRow() {
  props.editor.chain().focus().deleteRow().run()
}

function onMergeCell() {
  props.editor.chain().focus().mergeCells().run()
}
function onSplitCell() {
  props.editor?.chain().focus().splitCell().run()
}
function onDeleteTable() {
  props.editor.chain().focus().deleteTable().run()
}

function onSetCellBackground(color: string) {
  props.editor.chain().focus().setTableCellBackground(color).run()
}
const getReferenceClientRect: GetReferenceClientRect = () => {
  const {
    view,
    state: {
      selection: { from },
    },
  } = props.editor

  // 获取当前选中的表格节点
  const node = view.domAtPos(from).node as HTMLElement
  if (!node) return new DOMRect(-1000, -1000, 0, 0)
  // 获取表格元素
  const tableWrapper = node?.closest('.tableWrapper')
  if (!tableWrapper) return new DOMRect(-1000, -1000, 0, 0)

  // 获取表格的位置信息
  const rect = tableWrapper.getBoundingClientRect()
  // 返回一个新的 DOMRect，将 bubble menu 定位在表格的上方
  return rect
}
</script>
<template>
  <BubbleMenu
    :editor="editor"
    pluginKey="table"
    :shouldShow="shouldShow"
    :updateDelay="0"
    :tippy-options="{
      offset: [0, 8],
      maxWidth: 'auto',
      getReferenceClientRect,
      plugins: [sticky],
      sticky: 'popper',
    }"
  >
    <div
      class="min-w-32 flex flex-row h-full items-center leading-none gap-0.5 p-2 w-full bg-background rounded-lg shadow-sm border border-border"
    >
      <ActionButton
        icon="BetweenHorizonalEnd"
        :tooltip="t('editor.table.menu.insertColumnBefore')"
        :action="onAddColumnBefore"
        :tooltip-options="{
          sideOffset: 15,
        }"
        :disabled="!editor?.can().addColumnBefore()"
      />
      <ActionButton
        icon="BetweenHorizonalStart"
        :tooltip="t('editor.table.menu.insertColumnAfter')"
        :action="onAddColumnAfter"
        :tooltip-options="{
          sideOffset: 15,
        }"
        :disabled="!editor?.can().addColumnAfter()"
      />
      <ActionButton
        icon="ColumnDelete"
        :action="onDeleteColumn"
        :tooltip="t('editor.table.menu.deleteColumn')"
        :tooltip-options="{
          sideOffset: 15,
        }"
        :disabled="!editor?.can().deleteColumn()"
      />
      <Separator orientation="vertical" class="mx-1 me-2 h-[16px]" />

      <ActionButton
        icon="BetweenVerticalEnd"
        :action="onAddRowAbove"
        :tooltip="t('editor.table.menu.insertRowAbove')"
        :tooltip-options="{
          sideOffset: 15,
        }"
        :disabled="!editor?.can().addRowBefore()"
      />

      <ActionButton
        icon="BetweenVerticalStart"
        :action="onAddRowBelow"
        :tooltip="t('editor.table.menu.insertRowBelow')"
        :tooltip-options="{
          sideOffset: 15,
        }"
        :disabled="!editor?.can().addRowAfter()"
      />
      <ActionButton
        icon="RowDelete"
        :action="onDeleteRow"
        :tooltip="t('editor.table.menu.deleteRow')"
        :tooltip-options="{
          sideOffset: 15,
        }"
        :disabled="!editor?.can().deleteRow()"
      />
      <Separator orientation="vertical" class="mx-1 me-2 h-[16px]" />
      <ActionButton
        icon="TableCellsMerge"
        :action="onMergeCell"
        :tooltip="t('editor.table.menu.mergeCells')"
        :tooltip-options="{
          sideOffset: 15,
        }"
        :disabled="!editor?.can().mergeCells()"
      />
      <ActionButton
        icon="TableCellsSplit"
        :action="onSplitCell"
        :tooltip="t('editor.table.menu.splitCells')"
        :tooltip-options="{
          sideOffset: 15,
        }"
        :disabled="!editor?.can().splitCell()"
      />
      <Separator orientation="vertical" class="mx-1 me-2 h-[16px]" />

      <HighlightActionButton
        :editor="editor"
        :tooltip="t('editor.table.menu.setCellsBgColor')"
        :action="onSetCellBackground"
        :tooltip-options="{
          sideOffset: 15,
        }"
      />
      <ActionButton
        icon="Trash2"
        :tooltip="t('editor.table.menu.deleteTable')"
        :action="onDeleteTable"
        :tooltip-options="{
          sideOffset: 15,
        }"
        :disabled="!editor?.can().deleteTable()"
      />
    </div>
  </BubbleMenu>
</template>
