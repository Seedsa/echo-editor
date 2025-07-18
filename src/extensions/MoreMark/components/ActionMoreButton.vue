<script lang="ts" setup>
import { computed } from 'vue'
import { Icon } from '@/components/icons'
import type { Editor } from '@tiptap/vue-3'
import { MenuCheckboxItem, MenuShortcut } from '@/components/ui/menu'
import ActionDropdownButton from '@/components/ActionDropdownButton.vue'
import { getShortcutKeys } from '@/utils/plateform'
import type { Item } from '../types'

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
    <MenuCheckboxItem
      v-for="(item, index) in props.items"
      :model-value="active.title === item.title"
      @click="item.action"
      :key="index"
      :disabled="item.disabled"
      class="flex gap-3 items-center"
    >
      <Icon :name="item.icon" v-if="item.icon" />
      <span class="ml-1">{{ item.title }}</span>
      <MenuShortcut class="ml-auto" v-if="item.shortcutKeys">{{ getShortcutKeys(item.shortcutKeys) }}</MenuShortcut>
    </MenuCheckboxItem>
  </ActionDropdownButton>
</template>
