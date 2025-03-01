<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Check } from 'lucide-vue-next'
import { type HTMLAttributes } from 'vue'

interface MenuCheckboxItemProps {
  modelValue?: boolean
}
const props = defineProps<MenuCheckboxItemProps & { class?: HTMLAttributes['class'] }>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <div
    :class="
      cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent',
        props.class
      )
    "
    @click="emit('select')"
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <span v-if="modelValue">
        <Check class="h-4 w-4" />
      </span>
    </span>
    <slot />
  </div>
</template>
