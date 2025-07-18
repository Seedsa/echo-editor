<script lang="ts" setup>
import { Icon } from '@/components/icons'
import type { ButtonViewReturnComponentProps } from '@/type'
import { getShortcutKeys } from '@/utils/plateform'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface Props {
  icon?: any
  class?: string
  title?: string
  tooltip?: string
  disabled?: boolean
  shortcutKeys?: string[]
  color?: string
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}
const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  title: undefined,
  tooltip: undefined,
  disabled: false,
  color: undefined,
  shortcutKeys: undefined,
  action: undefined,
  isActive: undefined,
  class: '',
})
</script>

<template>
  <TooltipProvider>
    <Tooltip :delay-duration="0">
      <TooltipTrigger as-child>
        <Button :class="cn('h-[32px] px-1.5 py-0', props.class)" variant="ghost" :disabled="disabled">
          <div class="flex items-center h-full justify-between font-normal w-full">
            <div class="text-left truncate text-sm flex-grow" v-if="title">{{ title }}</div>
            <Icon class="w-[16px] h-[16px]" :name="icon" v-if="icon" />
            <Icon class="w-3 h-3 ml-1 text-zinc-500 flex-shrink-0" name="MenuDown" />
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent hideWhenDetached v-if="tooltip || (shortcutKeys && shortcutKeys.length)">
        <div class="max-w-24 text-center flex flex-col items-center">
          <div>{{ tooltip }}</div>
          <div class="flex" v-if="shortcutKeys && shortcutKeys.length">
            <span>{{ getShortcutKeys(shortcutKeys) }}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
