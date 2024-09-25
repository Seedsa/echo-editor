<script lang="ts" setup>
import type { StyleValue } from 'vue'
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu'
import ActionDropdownButton from '@/components/ActionDropdownButton.vue'
import type { ButtonViewReturnComponentProps } from '@/type'
import { useLocale } from '@/locales'

export interface Item {
  title: string
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: StyleValue
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
  icon: undefined,
  tooltip: '',
  shortcutKeys: undefined,
  items: () => [],
})
const { t } = useLocale()

const active = computed(() => {
  const find: any = props.items.find((k: any) => k.isActive())
  if (find) {
    return find
  }
  const item: Item = {
    title: t.value('editor.fontSize.default.tooltip'),
    isActive: () => false,
  }
  return item
})
</script>

<template>
  <ActionDropdownButton :disabled="disabled" :tooltip="tooltip" :title="active.title" btn_class="min-w-24 max-w-32">
    <div class="w-32 overflow-y-auto max-h-96">
      <template v-for="(item, index) in props.items" :key="index">
        <DropdownMenuCheckboxItem :checked="active.title === item.title" @click="item.action">
          <div class="ml-1 h-full">{{ item.title }}</div>
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator v-if="item.title === t('editor.fontSize.default.tooltip')" />
      </template>
    </div>
  </ActionDropdownButton>
</template>
