<script setup lang="ts">
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3'
import { Editor as CoreEditor } from '@tiptap/core'
import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import type { NodeSelection } from '@tiptap/pm/state'
import { CellSelection } from '@tiptap/pm/tables'
import { analyzeCellSelection, isRowGripSelected } from '../../utils'
import ActionButton from '@/components/ActionButton.vue'
import HighlightActionButton from '@/extensions/Highlight/components/HighlightActionButton.vue'

interface Props {
  editor: Editor
}
export interface ShouldShowProps {
  editor?: CoreEditor
  view: EditorView
  state?: EditorState
  oldState?: EditorState
  from?: number
  to?: number
}

const props = withDefaults(defineProps<Props>(), {})

export interface Emits {
  (event: 'onMergeCell'): void
  (event: 'onSplitCell'): void
  (event: 'setCellBackground', value: string): void
}
const emits = defineEmits<Emits>()

const shouldShow = ({ view, state, from }: ShouldShowProps) => {
  if (!state) {
    return false
  }

  return isRowGripSelected({
    editor: props.editor,
    view,
    state,
    from: from || 0,
  })
}
const Selection = computed(() => {
  const NodeSelection = props.editor.state.selection as NodeSelection
  const isCell = NodeSelection instanceof CellSelection
  if (isCell) {
    return analyzeCellSelection(props.editor)
  } else {
    return null
  }
})

function onAddRowBefore() {
  props.editor.chain().focus().addRowBefore().run()
}

function onAddRowAfter() {
  props.editor.chain().focus().addRowAfter().run()
}

function onDeleteRow() {
  props.editor.chain().focus().deleteRow().run()
}
</script>

<template>
  <BubbleMenu
    :editor="editor"
    pluginKey="tableRowMenu"
    :updateDelay="0"
    :should-show="shouldShow"
    :tippy-options="{
      appendTo: 'parent',
      placement: 'left',
      offset: [0, 15],
      popperOptions: {
        modifiers: [{ name: 'flip', enabled: false }],
      },
    }"
  >
    <div class="flex flex-col h-full leading-none gap-0.5 p-2 bg-background rounded-lg shadow-sm border border-border">
      <ActionButton
        icon="BetweenVerticalStart"
        :action="onAddRowBefore"
        tooltip="向上插入列"
        :tooltip-options="{
          sideOffset: 15,
          side: 'right',
        }"
      />

      <ActionButton
        icon="BetweenVerticalEnd"
        :action="onAddRowAfter"
        tooltip="向下插入列"
        :tooltip-options="{
          side: 'right',
          sideOffset: 15,
        }"
      />
      <ActionButton
        icon="Trash2"
        :action="onDeleteRow"
        :tooltip-options="{
          side: 'right',
          sideOffset: 15,
        }"
        tooltip="删除行"
      />
      <ActionButton
        v-if="Selection?.cellCount! > 1"
        icon="TableCellsMerge"
        :action="() => emits('onMergeCell')"
        tooltip="合并单元格"
        :tooltip-options="{
          side: 'right',
          sideOffset: 15,
        }"
      />
      <ActionButton
        v-if="Selection?.mergedCellCount! > 0"
        icon="TableCellsSplit"
        :action="() => emits('onSplitCell')"
        tooltip="拆分单元格"
        :tooltip-options="{
          side: 'right',
          sideOffset: 15,
        }"
      />

      <HighlightActionButton
        :editor="editor"
        tooltip="设置单元格背景色"
        :action="color => emits('setCellBackground', color as string)"
        :tooltip-options="{
          side: 'right',
          sideOffset: 15,
        }"
      />
    </div>
  </BubbleMenu>
</template>
