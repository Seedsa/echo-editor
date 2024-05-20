<script lang="ts" setup>
import type { StyleValue } from 'vue'
import { computed } from 'vue'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'

import type { Editor } from '@tiptap/vue-3'
import ActionMenuButton from '@/components/ActionMenuButton.vue'
import type { ButtonViewReturnComponentProps } from '@/type'
import { getShortcutKey } from '@/utils/plateform'

export interface Item {
  title: string
  icon?: any
  level?: number
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: StyleValue
  shortcutKeys?: string[]
  disabled?: boolean
  divider?: boolean
  default?: boolean
}
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
  <DropdownMenu>
    <DropdownMenuTrigger>
      <ActionMenuButton :title="active.title" :tooltip="tooltip" />
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-full">
      <template v-for="(item, index) in props.items" :key="index">
        <DropdownMenuCheckboxItem :checked="active.title === item.title" @click="item.action">
          <div class="ml-1 h-full" :class="`heading-` + item.level">
            {{ item.title }}
          </div>
          <DropdownMenuShortcut class="pl-4">{{
            item.shortcutKeys?.map(item => getShortcutKey(item)).join(' ')
          }}</DropdownMenuShortcut>
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator v-if="item.level === 0" />
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
