<script setup lang="ts">
import { computed, reactive, unref } from 'vue'
import type { NodeSelection } from '@tiptap/pm/state'
import { TextSelection } from '@tiptap/pm/state'
import { Separator } from '@/components/ui/separator'
import type { Editor, Extension } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3'
import type { BaseKitOptions } from '@/extensions/BaseKit'
import type { BubbleTypeMenu } from './bubble'
import { useLocale } from '@/locales'
import { CellSelection } from '@tiptap/pm/tables'

interface Props {
  editor: Editor
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const { t } = useLocale()
const tippyOptions = reactive<Record<string, unknown>>({
  maxWidth: 'auto',
  zIndex: 20,
  appendTo: 'parent',
  moveTransition: 'transform 0.15s ease-out',
})

const nodeType = computed(() => {
  const selection = props.editor.state.selection as NodeSelection
  const isImage = selection.node?.type.name === 'image'
  const isLink = props.editor.isActive('link')
  const isVideo = selection.node?.type.name === 'video'
  const isCell = selection instanceof CellSelection
  const isTable = selection.node?.type.name === 'table' || isCell
  const isText = selection instanceof TextSelection

  if (isLink) return 'link'
  if (isImage) return 'image'
  if (isVideo) return 'video'
  if (isTable) return 'table'
  if (isText) return 'text'

  return undefined
})

const nodeMenus = computed(() => {
  const { extensions = [] } = props.editor.extensionManager
  const find = extensions.find(k => k.name === 'base-kit') as Extension<BaseKitOptions>
  if (!find) return {}

  const { button } = find.options?.bubble ?? {}

  if (!button) return {}

  const _button: BubbleTypeMenu = button({
    editor: props.editor,
    extension: find,
    t: unref(t),
  })

  return _button
})

const items = computed(() => {
  if (!nodeType.value) return []
  return unref(nodeMenus)?.[nodeType.value] ?? []
})
</script>
<template>
  <BubbleMenu v-show="items.length > 0" :editor="editor" :tippy-options="tippyOptions">
    <div
      class="border border-neutral-200 dark:border-neutral-800 px-3 py-2 transition-all select-none pointer-events-auto shadow-sm rounded-sm w-auto bg-background"
    >
      <div class="flex items-center flex-nowrap whitespace-nowrap h-[26px] justify-start relative">
        <template v-for="(item, key) in items" :key="key">
          <!-- Divider -->
          <Separator v-if="item.type === 'divider'" orientation="vertical" class="mx-1 me-2 h-[16px]" />
          <!-- Buttons -->
          <component
            :is="item.component"
            v-else
            v-bind="item.componentProps"
            :editor="editor"
            :disabled="disabled || item.componentProps?.disabled"
          >
            <template v-for="(element, slotName, i) in item.componentSlots" :key="i" #[`${slotName}`]="values">
              <component :is="element" v-bind="values?.props" />
            </template>
          </component>
        </template>
      </div>
    </div>
  </BubbleMenu>
</template>
