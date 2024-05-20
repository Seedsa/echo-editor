<script setup lang="ts">
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { COLORS_LIST, DEFAULT_COLOR } from '@/constants'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { useLocale } from '@/locales'

interface Props {
  modelValue?: string
  highlight?: boolean
}

const { t } = useLocale()
interface Emits {
  (event: 'update:modelValue', color: string | undefined): void
  (event: 'change', color: string | undefined): void
}
// 将颜色值转换成数组
const colorsArray = COLORS_LIST
const chunkedColors: any = []
for (let i = 0; i < colorsArray.length; i += 10) {
  chunkedColors.push(colorsArray.slice(i, i + 10))
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  highlight: false,
})
const html5Color = ref<HTMLInputElement | null>(null)

const recentColorsStore = useLocalStorage<string[]>(props.highlight ? 'recentColorsHighlight' : 'recentColors', [])

const emit = defineEmits<Emits>()

function setRecentColor(color: string) {
  const index = recentColorsStore.value.indexOf(color)
  if (index !== -1) {
    recentColorsStore.value.splice(index, 1)
  }
  recentColorsStore.value.unshift(color)
  if (recentColorsStore.value.length > 10) {
    recentColorsStore.value.pop()
  }
}

function setColor(color: string | undefined) {
  if (color === undefined) {
    // clear color
    emit('update:modelValue', color)
    emit('change', color)
    return
  }
  // check if color is correct
  const isCorrectColor = /^#([0-9A-F]{3}){1,2}$/i.test(color)
  if (isCorrectColor) {
    emit('update:modelValue', color)
    emit('change', color)
    setRecentColor(color)
  }
}
const triggerHtml5Color = () => {
  html5Color.value?.click()
}
</script>
<template>
  <Popover>
    <PopoverTrigger>
      <slot />
    </PopoverTrigger>
    <PopoverContent hideWhenDetached class="p-2 w-full h-full" align="start" side="bottom">
      <div class="flex flex-col">
        <div
          class="flex items-center p-1 rd-1 cursor-pointer hover:bg-accent"
          v-if="highlight"
          @click="setColor(undefined)"
        >
          <span class="lake-colorboard-group-item lake-colorboard-group-item-border lake-colorboard-group-item-special"
            ><span style="background-color: transparent"
              ><svg viewBox="0 0 18 18" style="fill: rgba(0, 0, 0, 0.4); display: none">
                <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg></span
          ></span>
          <span class="text-sm ml-1">{{ t('editor.nofill') }}</span>
        </div>
        <div class="flex items-center p-1 rd-1 cursor-pointer hover:bg-accent" @click="setColor(undefined)" v-else>
          <span class="lake-colorboard-group-item"
            ><span :style="{ backgroundColor: DEFAULT_COLOR }"
              ><svg viewBox="0 0 18 18" style="fill: rgb(255, 255, 255); display: none">
                <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
              </svg> </span
          ></span>
          <span class="text-sm ml-1">{{ t('editor.default') }}</span>
        </div>
        <span class="lake-colorboard-group" v-for="(items, index) in chunkedColors" :key="index">
          <span class="lake-colorboard-group-item" v-for="(item, index) in items" :key="index" @click="setColor(item)">
            <span :style="{ backgroundColor: item }"
              ><svg v-if="item !== modelValue" viewBox="0 0 18 18" style="fill: rgb(255, 255, 255); display: none">
                <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
              </svg>
              <svg v-else viewBox="0 0 18 18" style="fill: rgb(255, 255, 255); display: block">
                <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg></span></span
        ></span>
        <div>
          <div class="text-sm my-1">{{ t('editor.recent') }}</div>
          <span class="lake-colorboard-group">
            <span
              class="lake-colorboard-group-item"
              v-for="(item, index) in recentColorsStore"
              :key="index"
              @click="setColor(item)"
            >
              <span :style="{ backgroundColor: item }"
                ><svg viewBox="0 0 18 18" style="fill: rgb(255, 255, 255); display: none">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
                </svg> </span></span
          ></span>
        </div>
        <div class="relative">
          <div class="text-sm hover:cursor-pointer hover:bg-accent py-1.5 px-1.5" @click="triggerHtml5Color">
            {{ t('editor.color.more') }}...
          </div>
          <input
            type="color"
            ref="html5Color"
            @change="
              (e: any) => {
                setColor(e.target.value)
              }
            "
            class="absolute left-0 top-4"
            style="visibility: hidden"
          />
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
