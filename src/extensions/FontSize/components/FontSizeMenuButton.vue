<script lang="ts" setup>
import type { StyleValue } from 'vue'
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { MenuCheckboxItem, MenuSeparator } from '@/components/ui/menu'
import ActionDropdownButton from '@/components/ActionDropdownButton.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
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
    <ScrollArea class="w-32 h-96">
      <template v-for="(item, index) in props.items" :key="index">
        <MenuCheckboxItem :model-value="active.title === item.title" @select="item.action">
          <div class="ml-1 h-full">{{ item.title }}</div>
        </MenuCheckboxItem>
        <MenuSeparator v-if="item.title === t('editor.fontSize.default.tooltip')" />
      </template>
    </ScrollArea>
  </ActionDropdownButton>
</template>
