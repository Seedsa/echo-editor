<script lang="ts" setup>
import type { StyleValue } from 'vue'
import { computed } from 'vue'
import { Icon, icons } from '@/components/icons'
import type { Editor } from '@tiptap/vue-3'
import { DropdownMenuCheckboxItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu'
import ActionDropdownButton from '@/components/ActionDropdownButton.vue'
import type { ButtonViewReturnComponentProps } from '@/type'
import { getShortcutKeys } from '@/utils/plateform'

export interface Item {
  title: string
  icon?: keyof typeof icons
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
  maxHeight?: string | number
  icon?: any
  tooltip?: string
  items?: Item[]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  color: undefined,
  maxHeight: undefined,
  icon: undefined,
  tooltip: '',
  items: () => [],
})

const active = computed(() => {
  const find: any = props.items.find((k: any) => k.isActive())
  if (find && !find.default) {
    return {
      ...find,
      icon: find.icon ? find.icon : props.icon,
    }
  }
  const item: Item = {
    title: props.tooltip,
    icon: props.icon,
    isActive: () => false,
  }

  return item
})
</script>

<template>
  <ActionDropdownButton :icon="icon" :tooltip="tooltip" :disabled="disabled">
    <DropdownMenuCheckboxItem
      v-for="(item, index) in props.items"
      :checked="active.title === item.title"
      @click="item.action"
      :key="index"
      class="flex gap-3 items-center"
    >
      <Icon :name="item.icon" v-if="item.icon" />
      <span class="ml-1">{{ item.title }}</span>
      <DropdownMenuShortcut class="ml-auto" v-if="item.shortcutKeys">{{
        getShortcutKeys(item.shortcutKeys)
      }}</DropdownMenuShortcut>
    </DropdownMenuCheckboxItem>
  </ActionDropdownButton>
</template>
