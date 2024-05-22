<script setup lang="ts">
import { computed, unref, watch } from 'vue'
import { useFullscreen } from '@vueuse/core'
import ActionButton from '@/components/ActionButton.vue'
import { useTiptapStore } from '@/hooks'
import { useLocale } from '@/locales'
import { ButtonViewReturnComponentProps } from '@/type'

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  color: undefined,
  isActive: undefined,
  useWindow: false,
})
const { t } = useLocale()

const { toggleFullscreen } = useTiptapStore()!
const { isFullscreen, toggle } = useFullscreen()

interface Props {
  disabled?: boolean
  color?: string
  isActive?: ButtonViewReturnComponentProps['isActive']
  useWindow?: boolean
}

watch(
  () => isFullscreen.value,
  (val, oldVal) => {
    // 同步状态
    if (val !== oldVal) {
      toggleFullscreen()
    }
  }
)

const text = computed(() => {
  const tooltip = isFullscreen.value ? 'editor.fullscreen.tooltip.exit' : 'editor.fullscreen.tooltip.fullscreen'
  if (!tooltip) return undefined
  return unref(t)(tooltip)
})

const icon = computed(() => {
  const _icon = isFullscreen.value ? 'Minimize' : 'Maximize'
  return _icon
})

function onAction(_useWindow: boolean = false) {
  toggle()
}
</script>

<template>
  <ActionButton :icon="icon" :tooltip="text" :action="onAction"></ActionButton>
</template>
