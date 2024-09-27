<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import ActionMenuButton from '@/components/ActionMenuButton.vue'
import { ButtonViewReturnComponentProps } from '@/type'
import { cn } from '@/utils'

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
  <DropdownMenu>
    <DropdownMenuTrigger :disabled="disabled">
      <ActionMenuButton
        :class="btn_class"
        :title="title"
        :icon="icon"
        :tooltip="tooltip"
        :disabled="disabled"
        :is-active="isActive"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent :class="cn('min-w-24', props.class)" align="start" side="bottom" v-bind="$attrs">
      <slot />
    </DropdownMenuContent>
  </DropdownMenu>
</template>
