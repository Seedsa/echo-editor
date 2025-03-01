<script setup lang="ts">
import { ref, computed, unref } from 'vue'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Editor } from '@tiptap/vue-3'
import { useLocale } from '@/locales'
import ActionDropdownButton from '@/components/ActionDropdownButton.vue'

import { ButtonViewReturnComponentProps } from '@/type'
const { t } = useLocale()

function percentageToDecimal(percentageString) {
  // 去掉百分号并转换成数字
  const percentage = parseFloat(percentageString.replace('%', ''))
  // 将百分比转换成小数
  const decimal = percentage / 100
  return decimal
}
const LineHeights = computed(() => {
  const lineHeightOptions = props.editor.extensionManager.extensions.find(e => e.name === 'lineHeight')!.options
  const a = lineHeightOptions.lineHeights
  const b = a.map(item => ({
    label: percentageToDecimal(item),
    value: item,
  }))

  b.unshift({
    label: unref(t)('editor.default'),
    value: 'default',
  })
  return b
})

const value = ref('default')
interface Props {
  editor: Editor
  icon?: any
  tooltip?: string
  disabled?: boolean
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  tooltip: undefined,
  disabled: false,
  action: undefined,
  isActive: undefined,
})

function toggleLineHeight(key: string) {
  if (key === 'default') {
    props.editor.chain().unsetLineHeight().focus().run()
  } else {
    props.editor.chain().setLineHeight(key).focus().run()
  }
  value.value = key
}
</script>

<template>
  <ActionDropdownButton :icon="icon" :tooltip="tooltip" :disabled="disabled">
    <div v-for="(item, index) in LineHeights" @click="toggleLineHeight(item.value)" :key="index">{{ item.label }}</div>
    <DropdownMenuCheckboxItem
      v-for="(item, index) in LineHeights"
      :key="index"
      :checked="item.value === value"
      @select="toggleLineHeight(item.value)"
    >
      {{ item.label }}
    </DropdownMenuCheckboxItem>
  </ActionDropdownButton>
</template>
