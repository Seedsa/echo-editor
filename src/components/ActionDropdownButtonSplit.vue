<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import ActionMenuButton from '@/components/ActionMenuButton.vue'
import Button from '@/components/ui/button/Button.vue'
import ActionButton from './ActionButton.vue'
import { Icon } from '@/components/icons'
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
  <div class="flex items-center h-[32px] hover:bg-muted rounded-md">
    <ActionButton
      :class="btn_class"
      :action="action"
      :title="title"
      :icon="icon"
      :tooltip="tooltip"
      :disabled="disabled"
    >
    </ActionButton>
    <DropdownMenu>
      <DropdownMenuTrigger :disabled="disabled">
        <Button
          variant="ghost"
          size="icon"
          class="h-[32px] w-3 rounded-l-none hover:bg-muted-foreground/20"
          :disabled="disabled"
        >
          <Icon class="w-3 h-3 text-zinc-500" name="MenuDown" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent :class="cn('min-w-24', props.class)" align="start" side="bottom" v-bind="$attrs">
        <slot />
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
