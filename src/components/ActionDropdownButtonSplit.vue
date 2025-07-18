<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Button from '@/components/ui/button/Button.vue'
import ActionButton from './ActionButton.vue'
import { Icon } from '@/components/icons'
import type { ButtonViewReturnComponentProps } from '@/type'
import { cn } from '@/utils'

interface Props {
  icon?: any
  title?: string
  tooltip?: string
  disabled?: boolean
  class?: string
  shortcutKeys?: string[]
  btn_class?: string
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  title: undefined,
  tooltip: undefined,
  disabled: false,
  action: undefined,
  isActive: undefined,
  shortcutKeys: undefined,
  class: '',
  btn_class: '',
})
</script>

<template>
  <div class="flex items-center h-[32px] hover:bg-muted rounded-md" :class="[isActive?.() && 'bg-muted']">
    <ActionButton
      :class="btn_class"
      :action="action"
      :title="title"
      :icon="icon"
      :tooltip="tooltip"
      :disabled="disabled"
      :shortcut-keys="shortcutKeys"
    >
    </ActionButton>
    <Popover>
      <PopoverTrigger :disabled="disabled">
        <Button
          variant="ghost"
          size="icon"
          class="h-[32px] w-3 rounded-l-none hover:bg-muted-foreground/20"
          :disabled="disabled"
        >
          <Icon class="w-3 h-3 text-zinc-500" name="MenuDown" />
        </Button>
      </PopoverTrigger>
      <PopoverContent :class="cn('min-w-32 p-1 w-full', props.class)" align="start" side="bottom" v-bind="$attrs">
        <slot />
      </PopoverContent>
    </Popover>
  </div>
</template>
