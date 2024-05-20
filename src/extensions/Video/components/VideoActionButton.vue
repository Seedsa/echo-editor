<script setup lang="ts">
import { ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'

import ActionButton from '@/components/ActionButton.vue'
import { ButtonViewReturnComponentProps } from '@/type'

interface Props {
  editor: Editor
  upload?: (file: File[]) => Promise<string>
  icon?: any
  tooltip?: string
  disabled?: boolean
  color?: string
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  tooltip: undefined,
  disabled: false,
  color: undefined,
  action: undefined,
  isActive: undefined,
})

const fileInput = ref<HTMLInputElement | null>()

async function handleFileChange(event) {
  const files = event.target.files
  if (!props.editor || props.editor.isDestroyed || files.length === 0) return
  // 如果props.upload不存在 则提示错误
  if (!props.upload) {
    console.error('Please provide the `upload` prop to handle video uploads.')
    return
  }
  const videoSrc = await props.upload!(files[0])
  props.editor.commands.setVideo({
    src: videoSrc,
    width: '100%',
  })
}
function onAction() {
  fileInput.value?.click()
}
</script>

<template>
  <ActionButton
    :icon="icon"
    :tooltip="tooltip"
    :disabled="disabled"
    :color="color"
    :is-active="isActive"
    :action="onAction"
  />
  <input type="file" accept="video/*" ref="fileInput" multiple style="display: none" @change="handleFileChange" />
</template>
