<script lang="ts" setup>
import { Icon } from '@/components/icons'
import { ButtonViewReturnComponentProps } from '@/type'
import { getShortcutKeys } from '@/utils/plateform'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

interface Props {
  icon?: any
  title?: string
  tooltip?: string
  disabled?: boolean
  shortcutKeys?: string[]
  color?: string
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}
withDefaults(defineProps<Props>(), {
  icon: undefined,
  title: undefined,
  tooltip: undefined,
  disabled: false,
  color: undefined,
  shortcutKeys: undefined,
  action: undefined,
  isActive: undefined,
})
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button :icon="icon" class="h-[32px] px-[5px] py-0 min-w-24 max-w-32" variant="ghost" :disabled="disabled">
          <div class="flex items-center h-full font-normal">
            <div class="text-left truncate text-sm flex-grow">{{ title }}</div>
            <Icon class="w-3 h-3 ml-1 text-zinc-500 flex-shrink-0" name="MenuDown" />
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
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
