<script setup lang="ts">
import { ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { ImageTab, ImageTabKey } from '../types'
import ActionButton from '@/components/ActionButton.vue'
import { ImageNodeAttributes, insertImages } from '@/utils/image'

import { ButtonViewReturnComponentProps } from '@/type'

interface Props {
  editor: Editor
  upload?: (files: File[]) => ImageNodeAttributes[] | Promise<ImageNodeAttributes[]>
  imageTabs?: ImageTab[]
  hiddenTabs?: ImageTabKey[]
  icon?: any
  tooltip?: string
  disabled?: boolean
  color?: string
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}

const props = withDefaults(defineProps<Props>(), {
  upload: undefined,
  imageTabs: () => [],
  hiddenTabs: () => [],
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
    console.error('Please provide the `upload` prop to handle file uploads.')
    return
  }
  const attributesForImages = await props.upload!(Array.from(files))
  insertImages({
    editor: props.editor,
    images: attributesForImages,
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
  <input type="file" accept="image/*" ref="fileInput" multiple style="display: none" @change="handleFileChange" />
</template>
