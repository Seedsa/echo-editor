<template>
  <div class="p-2 bg-background rounded-sm shadow-sm border">
    <div
      v-for="item in items"
      :key="item.label"
      class="relative flex items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
      @mouseenter="item.isHovered = true"
      @mouseleave="item.isHovered = false"
      @click="handleClick(item)"
    >
      <span>{{ item.label }}</span>
      <Icon v-if="item.children" name="ChevronRight" class="ml-auto h-4 w-4" />
      <div v-if="item.children && item.isHovered" class="absolute left-full top-0 bg-background shadow-md rounded-sm">
        <div class="p-2">
          <div
            v-for="subItem in item.children"
            :key="subItem.label"
            @click="handleClick(subItem)"
            class="flex items-center rounded-sm px-2 py-1.5 text-sm whitespace-nowrap outline-none transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            <span>{{ subItem.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/components/icons'

// 定义 props
interface MenuItem {
  label: string
  isHovered?: boolean
  children?: MenuItem[]
}

const props = defineProps<{
  items: MenuItem[]
}>()
const emit = defineEmits<{
  (e: 'itemClick', item: MenuItem): void
}>()

const handleClick = (item: MenuItem) => {
  if (item.children) {
    return
  }
  emit('itemClick', item)
}
</script>
