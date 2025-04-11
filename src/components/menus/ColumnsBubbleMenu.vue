<script setup lang="ts">
import { sticky } from 'tippy.js'
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu, isActive } from '@tiptap/vue-3'
import ActionButton from '@/components/ActionButton.vue'
import { ColumnLayout } from '@/extensions/MultiColumn'
import { getRenderContainer } from '@/utils/getRenderContainer'
import { useLocale } from '@/locales'

interface Props {
  editor: Editor
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})
const { t } = useLocale()

const shouldShow = ({ editor }) => {
  return isActive(editor.view.state, 'columns')
}
// 获取参考元素的位置
const getReferenceClientRect = () => {
  const renderContainer = getRenderContainer(props.editor, 'columns')
  const rect = renderContainer?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0)

  return rect
}

const onDelete = () => {
  props.editor.chain().focus().deleteNode('columns').run()
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
          icon="Trash"
          :tooltip="t('editor.remove')"
          :action="onDelete"
          :isActive="() => editor.isActive('columns', { layout: ColumnLayout.SidebarLeft })"
          :tooltip-options="{ sideOffset: 15 }"
        />
      </div>
    </div>
  </BubbleMenu>
</template>
