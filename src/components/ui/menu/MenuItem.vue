<script setup lang="ts">
import { cn } from '@/lib/utils'
import { type DropdownMenuItemProps, useForwardProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<DropdownMenuItemProps & { class?: HTMLAttributes['class']; inset?: boolean }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <div
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex select-none items-center p-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent rounded-sm gap-2',
        inset && 'pl-8',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
