<script setup lang="ts">
import { sticky } from 'tippy.js'
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu, isActive } from '@tiptap/vue-3'
import ActionButton from '@/components/ActionButton.vue'
import { ColumnLayout } from '@/extensions/MultiColumn'
import { getRenderContainer } from '@/utils/getRenderContainer'

interface Props {
  editor: Editor
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const shouldShow = ({ editor }) => {
  return isActive(editor.view.state, 'columns')
}
// 获取参考元素的位置
const getReferenceClientRect = () => {
  const renderContainer = getRenderContainer(props.editor, 'columns')
  const rect = renderContainer?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0)

  return rect
}

const onColumnLeft = () => {
  props.editor.chain().focus().setLayout(ColumnLayout.SidebarLeft).run()
}

const onColumnRight = () => {
  props.editor.chain().focus().setLayout(ColumnLayout.SidebarRight).run()
}

const onColumnTwo = () => {
  props.editor.chain().focus().setLayout(ColumnLayout.TwoColumn).run()
}
</script>

<template>
  <BubbleMenu
    :editor="editor"
    pluginKey="columns"
    :shouldShow="shouldShow"
    :updateDelay="0"
    :tippy-options="{
      offset: [0, 8],
      popperOptions: {
        modifiers: [{ name: 'flip', enabled: false }],
      },
      getReferenceClientRect,
      plugins: [sticky],
      sticky: 'popper',
    }"
  >
    <div class="p-2 bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800">
      <div class="flex gap-1 items-center">
        <ActionButton
          icon="PanelLeft"
          tooltip="左侧边栏"
          :action="onColumnLeft"
          :isActive="() => editor.isActive('columns', { layout: ColumnLayout.SidebarLeft })"
          :tooltip-options="{ sideOffset: 15 }"
        />
        <ActionButton
          icon="Columns"
          tooltip="两栏布局"
          :action="onColumnTwo"
          :isActive="() => editor.isActive('columns', { layout: ColumnLayout.TwoColumn })"
          :tooltip-options="{ sideOffset: 15 }"
        />
        <ActionButton
          icon="PanelRight"
          tooltip="右侧边栏"
          :action="onColumnRight"
          :isActive="() => editor.isActive('columns', { layout: ColumnLayout.SidebarRight })"
          :tooltip-options="{ sideOffset: 15 }"
        />
      </div>
    </div>
  </BubbleMenu>
</template>
