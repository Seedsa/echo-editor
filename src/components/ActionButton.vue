<script lang="ts" setup>
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
</script>

<template>
  <Tooltip>
    <TooltipTrigger>
      <Toggle
        size="sm"
        class="w-[32px] h-[32px]"
        :pressed="isActive?.() || false"
        :disabled="disabled"
        :class="[customClass]"
        @click="action"
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
    </TooltipTrigger>
    <TooltipContent v-if="tooltip" v-bind="tooltipOptions">
      <div class="max-w-24 text-center flex flex-col items-center">
        <div>{{ tooltip }}</div>
        <div v-if="shortcutKeys && shortcutKeys.length" style="display: flex; gap: 4px">
          <span v-for="(shortcutKey, index) in shortcutKeys" :key="index">
            {{ getShortcutKey(shortcutKey) }}
          </span>
        </div>
      </div>
    </TooltipContent>
  </Tooltip>
</template>
