<script lang="ts" setup>
import { ref } from 'vue'
import { ButtonViewReturnComponentProps } from '@/type'
import { getShortcutKey } from '@/utils/plateform'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { TooltipContentProps } from 'radix-vue'
import { icons, Icon } from '@/components/icons'

interface Props {
  icon?: keyof typeof icons
  title?: string
  tooltip?: string
  disabled?: boolean
  shortcutKeys?: string[]
  customClass?: string
  loading?: boolean
  tooltipOptions?: TooltipContentProps
  color?: string
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}
const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  title: undefined,
  tooltip: undefined,
  disabled: false,
  customClass: '',
  color: undefined,
  loading: false,
  shortcutKeys: undefined,
  tooltipOptions: undefined,
  action: undefined,
  isActive: undefined,
})
const open = ref(false)
</script>

<template>
  <Toggle
    size="sm"
    class="w-[32px] h-[32px]"
    :pressed="isActive?.() || false"
    :disabled="disabled"
    :class="[customClass]"
    @click="open = true"
  >
    <div v-if="loading">
      <Icon class="animate-spin" name="LoaderCircle" />
    </div>
    <div class="flex gap-1 items-center" v-else>
      <Icon v-if="icon" :name="icon" />
      <slot name="icon"></slot>
    </div>
    <slot></slot>
  </Toggle>
</template>
