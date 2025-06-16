<script setup lang="ts">
import { computed } from 'vue'
import icons from './IconMap'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/utils'
import { HelpCircle } from 'lucide-vue-next'

const props = defineProps<{
  name: keyof typeof icons
  class?: HTMLAttributes['class']
}>()

const IconComponent = computed(() => {
  const icon = icons[props.name]

  if (!icon) {
    console.error(`Icon ${props.name} not found`)
    return HelpCircle
  }

  return icon
})
</script>

<template>
  <component :is="IconComponent" v-if="IconComponent" :class="cn('w-4 h-4', props.class)" />
</template>
