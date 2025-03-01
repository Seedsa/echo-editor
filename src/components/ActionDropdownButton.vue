<script setup lang="ts">
import ActionMenuButton from '@/components/ActionMenuButton.vue'
import { ButtonViewReturnComponentProps } from '@/type'
import { cn } from '@/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Props {
  icon?: any
  title?: string
  tooltip?: string
  disabled?: boolean
  class?: string
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
  class: '',
  btn_class: '',
})
</script>

<template>
  <Popover>
    <PopoverTrigger :disabled="disabled">
      <ActionMenuButton
        :class="btn_class"
        :title="title"
        :icon="icon"
        :tooltip="tooltip"
        :disabled="disabled"
        :is-active="isActive"
      />
    </PopoverTrigger>
    <PopoverContent :class="cn('p-1 min-w-32 w-full', props.class)" align="start" side="bottom">
      <slot />
    </PopoverContent>
  </Popover>
</template>
