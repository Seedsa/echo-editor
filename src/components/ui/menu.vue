<template>
  <div class="p-2 bg-background rounded-sm shadow-sm border flex flex-col gap-1">
    <div
      v-for="item in menuItems"
      :key="item.label"
      class="relative flex items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
      @mouseenter="item.isHovered = true"
      @mouseleave="item.isHovered = false"
      @click="handleClick(item)"
    >
      <span>{{ item.label }}</span>
      <Icon v-if="item.children" name="ChevronRight" class="ml-auto h-4 w-4" />
      <div v-if="item.children && item.isHovered" class="absolute left-full top-0 bg-background shadow-md rounded-sm">
        <div class="p-2 flex flex-col gap-1">
          <div
            v-for="subItem in item.children"
            :key="subItem.label"
            @click="handleClick(subItem)"
            class="min-w-40 flex items-center rounded-sm px-2 py-1.5 text-sm whitespace-nowrap outline-none transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
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
import { reactive, onMounted, watch } from 'vue'

// 定义 props
interface MenuItem {
  label: string
  isHovered?: boolean
  children?: MenuItem[]
  [key: string]: any // 允许其他属性
}

const props = defineProps<{
  items: MenuItem[]
}>()
const emit = defineEmits<{
  (e: 'itemClick', item: MenuItem): void
}>()

// 将菜单项转换为响应式数据
const menuItems = reactive<MenuItem[]>([])

onMounted(() => {
  // 初始化响应式菜单项
  menuItems.splice(
    0,
    menuItems.length,
    ...props.items.map(item => ({
      ...item,
      isHovered: false,
      children: item.children?.map(child => ({
        ...child,
        isHovered: false,
      })),
    }))
  )
})

// 添加 watch 来处理 props 更新
watch(
  () => props.items,
  newItems => {
    menuItems.splice(
      0,
      menuItems.length,
      ...newItems.map(item => ({
        ...item,
        isHovered: false,
        children: item.children?.map(child => ({
          ...child,
          isHovered: false,
        })),
      }))
    )
  },
  { deep: true }
)

const handleClick = (item: MenuItem) => {
  if (item.children) {
    return
  }
  emit('itemClick', item)
}
</script>
