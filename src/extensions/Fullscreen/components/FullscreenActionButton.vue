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

const { state, toggleFullscreen } = useTiptapStore()!
const { isFullscreen, enter, exit } = useFullscreen()

interface Props {
  disabled?: boolean
  color?: string
  isActive?: ButtonViewReturnComponentProps['isActive']
  useWindow?: boolean
}

watch(isFullscreen, val => {
  if (!val && state.isFullscreen && props.useWindow) {
    onAction()
  }
})

const text = computed(() => {
  const tooltip = state.isFullscreen ? 'editor.fullscreen.tooltip.exit' : 'editor.fullscreen.tooltip.fullscreen'
  if (!tooltip) return undefined
  return unref(t)(tooltip)
})

const icon = computed(() => {
  const _icon = state.isFullscreen ? 'Minimize' : 'Maximize'
  return _icon
})

function onAction(_useWindow: boolean = false) {
  toggleFullscreen()

  if (state.isFullscreen) {
    document.documentElement.classList.add('overflow-y-hidden')
    _useWindow && enter()
  } else {
    document.documentElement.classList.remove('overflow-y-hidden')
    _useWindow && exit()
  }
}
</script>

<template>
  <ActionButton :icon="icon" :tooltip="text" :action="onAction as any"> </ActionButton>
</template>
