<script lang="ts" setup>
import { ButtonViewReturnComponentProps } from '@/type'
import { getShortcutKey } from '@/utils/plateform'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import type { TooltipContentProps } from 'radix-vue'
import { icons, Icon } from '@/components/icons'
import type { Editor } from '@tiptap/core'
import type { HTMLAttributes } from 'vue'

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
  editor?: Editor
  class?: HTMLAttributes['class']
}
withDefaults(defineProps<Props>(), {
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
  <TooltipProvider>
    <Tooltip :delay-duration="0">
      <TooltipTrigger>
        <Toggle
          size="sm"
          class="h-[32px]"
          :pressed="isActive?.() || false"
          :disabled="disabled"
          :class="[customClass, title ? 'w-auto' : 'w-[32px]']"
          @click="action"
        >
          <div v-if="loading">
            <Icon class="animate-spin" name="LoaderCircle" />
          </div>
          <div class="flex gap-1 items-center" v-else>
            <Icon v-if="icon" :name="icon" />
            <slot name="icon"></slot>
          </div>
          <div class="ml-1 font-normal" v-if="title">{{ title }}</div>
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
  </TooltipProvider>
</template>
