<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import { Icon } from '@/components/icons'
import { MenuListProps } from './types'
import { useLocale } from '@/locales'

// 选中的索引
const selectedCommandIndex = ref(0)
const selectedGroupIndex = ref(0)
// 滚动ref
const scrollContainer = ref<HTMLDivElement | null>(null)

const { t } = useLocale()

const activeItemRefs = ref<(HTMLButtonElement | null)[]>([])
const props = withDefaults(defineProps<MenuListProps>(), {
  items: undefined,
  command: undefined,
})

defineExpose({ onKeyDown })

watch([() => selectedCommandIndex.value, () => selectedGroupIndex.value], async () => {
  if (!scrollContainer.value) return
  await nextTick() // 等待 DOM 更新完成
  const activeItemIndex = selectedGroupIndex.value * 1000 + selectedCommandIndex.value
  // 取当前选中的dom元素
  const activeItem = activeItemRefs.value[activeItemIndex]
  if (activeItem) {
    activeItem.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }
})

function onKeyDown({ event }) {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}

function upHandler() {
  if (!props.items.length) {
    return false
  }
  let newCommandIndex = selectedCommandIndex.value - 1
  let newGroupIndex = selectedGroupIndex.value

  if (newCommandIndex < 0) {
    newGroupIndex = selectedGroupIndex.value - 1
    newCommandIndex = props.items[newGroupIndex]?.commands.length - 1 || 0
  }

  if (newGroupIndex < 0) {
    newGroupIndex = props.items.length - 1
    newCommandIndex = props.items[newGroupIndex].commands.length - 1
  }

  selectedCommandIndex.value = newCommandIndex
  selectedGroupIndex.value = newGroupIndex
}

function downHandler() {
  if (!props.items.length) {
    return false
  }
  const commands = props.items[selectedGroupIndex.value].commands
  let newCommandIndex = selectedCommandIndex.value + 1
  let newGroupIndex = selectedGroupIndex.value

  if (commands.length - 1 < newCommandIndex) {
    newCommandIndex = 0
    newGroupIndex = selectedGroupIndex.value + 1
  }
  if (props.items.length - 1 < newGroupIndex) {
    newGroupIndex = 0
  }
  selectedCommandIndex.value = newCommandIndex
  selectedGroupIndex.value = newGroupIndex
}

function enterHandler() {
  if (!props.items.length || selectedGroupIndex.value === -1 || selectedCommandIndex.value === -1) {
    return false
  }

  selectItem(selectedGroupIndex.value, selectedCommandIndex.value)
}

function selectItem(groupIndex: number, commandIndex: number) {
  const command = props.items[groupIndex].commands[commandIndex]
  props.command(command)
}

function createCommandClickHandler(groupIndex: number, commandIndex: number) {
  selectItem(groupIndex, commandIndex)
}
function setActiveItemRef(groupIndex: number, commandIndex: number, el: any) {
  activeItemRefs.value[groupIndex * 1000 + commandIndex] = el
}
</script>
<template>
  <div
    class="rounded-lg bg-background shadow-sm border max-h-[min(80vh,24rem)] overflow-auto flex-wrap mb-8 p-1"
    ref="scrollContainer"
  >
    <div class="grid grid-cols-1 gap-0.5 min-w-48" v-if="items?.length">
      <template v-for="(group, groupIndex) in items" :key="group.title">
        <div
          className="text-[0.65rem] col-[1/-1] mx-2 mt-2 font-semibold tracking-wider select-none uppercase first:mt-0.5"
        >
          {{ group.title }}
        </div>
        <button
          class="flex items-center gap-3 px-2 py-1.5 text-sm text-neutral-800 dark:text-neutral-200 text-left w-full rounded-sm outline-none transition-colors"
          :class="[
            selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex
              ? 'bg-accent text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200'
              : 'hover:bg-accent hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200',
          ]"
          :ref="el => setActiveItemRef(groupIndex, commandIndex, el)"
          v-for="(command, commandIndex) in group.commands"
          :key="commandIndex"
          @click="createCommandClickHandler(groupIndex, commandIndex)"
        >
          <img v-if="command.iconUrl" class="w-6 h-6" :src="command.iconUrl" />
          <div v-else-if="command.iconClassName" :class="command.iconClassName" />
          <Icon v-else-if="command.iconName" :name="command.iconName" class="mr-1 text-lg" />
          {{ command.label }}
        </button>
      </template>
    </div>
    <div class="p-3" v-else>
      <span class="text-xs text-gray-800 dark:text-gray-100">{{ t('editor.slash.empty') }}</span>
    </div>
  </div>
</template>
