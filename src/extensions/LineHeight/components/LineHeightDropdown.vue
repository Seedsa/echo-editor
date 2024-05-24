<script setup lang="ts">
import { ref, computed, unref } from 'vue'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Editor } from '@tiptap/vue-3'
import { useLocale } from '@/locales'
import { Icon } from '@/components/icons'
import ActionButton from '@/components/ActionButton.vue'
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

function toggleLightheight(key: string) {
  if (key === 'default') {
    props.editor.commands.unsetLineHeight()
  } else {
    props.editor.commands.setLineHeight(key)
  }
  value.value = key
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <ActionButton custom-class="w-12" icon="LineHeight" :tooltip="tooltip">
        <Icon class="w-3 h-3 text-zinc-500 ml-1" name="MenuDown" />
      </ActionButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="min-w-24">
      <DropdownMenuCheckboxItem
        v-for="(item, index) in LineHeights"
        :key="index"
        :checked="item.value === value"
        @click="toggleLightheight(item.value)"
      >
        {{ item.label }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
