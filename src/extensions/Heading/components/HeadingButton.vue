<script lang="ts" setup>
import { computed } from 'vue'
import { MenuCheckboxItem, MenuSeparator, MenuShortcut } from '@/components/ui/menu'

import type { Editor } from '@tiptap/vue-3'
import ActionDropdownButton from '@/components/ActionDropdownButton.vue'
import { getShortcutKey } from '@/utils/plateform'
import type { Item } from '../types'

interface Props {
  editor: Editor
  disabled?: boolean
  color?: string
  shortcutKeys?: string[]
  maxHeight?: string | number
  tooltip?: string
  items?: Item[]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  color: undefined,
  maxHeight: undefined,
  tooltip: '',
  shortcutKeys: undefined,
  items: () => [],
})

const active = computed(() => {
  const find: any = props.items.find((k: any) => k.isActive())
  if (find && !find.default) {
    return {
      ...find,
    }
  }
  const item: Item = {
    title: props.tooltip,
    level: 0,
    isActive: () => false,
  }
  return item
})
</script>

<template>
  <ActionDropdownButton :disabled="disabled" :tooltip="tooltip" :title="active?.title" btn_class="min-w-24 max-w-32">
    <template v-for="(item, index) in props.items" :key="index">
      <MenuCheckboxItem :model-value="active.title === item.title" @click="item.action">
        <div class="ml-1 h-full" :class="`heading-` + item.level">
          {{ item.title }}
        </div>
        <MenuShortcut class="pl-4">{{ item.shortcutKeys?.map(item => getShortcutKey(item)).join(' ') }}</MenuShortcut>
      </MenuCheckboxItem>
      <MenuSeparator v-if="item.level === 0" />
    </template>
  </ActionDropdownButton>
</template>
