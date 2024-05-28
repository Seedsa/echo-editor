<script lang="ts" setup>
import { ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { useToast } from '@/components/ui/toast/use-toast'
import { ButtonViewReturnComponentProps } from '@/type'
import ActionButton from '@/components/ActionButton.vue'
import { hasExtension } from '@/utils/utils'

interface Props {
  editor: Editor
  icon?: any
  title?: string
  convert?: (file: File) => Promise<string>
  tooltip?: string
  disabled?: boolean
  shortcutKeys?: string[]
  color?: string
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}
const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  title: undefined,
  tooltip: undefined,
  disabled: false,
  color: undefined,
  shortcutKeys: undefined,
  action: undefined,
  convert: undefined,
  isActive: undefined,
})
const { toast } = useToast()
const loading = ref(false)
const file = ref()
const fileInput = ref()
function triggerFileInput() {
  fileInput.value.click()
}
function handleFileChange(event) {
  file.value = event.target.files[0]
  if (file.value) {
    importWord()
  }
}
function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64.split(',')[1])
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}
// 将 Blob 转换成 File 对象
function blobToFile(blob, fileName) {
  return new File([blob], fileName, { type: blob.type })
}
async function filerImage(html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const images = doc.querySelectorAll('img')
  if (!images.length) {
    return doc.body.innerHTML
  }
  const hasImage = hasExtension(props.editor, 'image')
  if (hasImage) {
    const uploadOptions = props.editor.extensionManager.extensions.find(
      extension => extension.name === 'importWord'
    )?.options
    if (uploadOptions && typeof uploadOptions.upload === 'function') {
      const files: File[] = []
      for (let img of images) {
        const originalSrc = img.getAttribute('src')
        const blob = base64ToBlob(originalSrc, 'image/jpeg')
        // 将 Blob 转换成 File
        const file = blobToFile(blob, 'image.jpeg')
        files.push(file)
      }
      const uploadRes = await uploadOptions.upload(files)
      // 批量设置images
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        img.setAttribute('src', uploadRes[i].src)
      }
      return doc.body.innerHTML
    } else {
      console.log('未找到上传方法 跳过图片转换')
      return doc.body.innerHTML
    }
  } else {
    console.error('未找到image拓展，无法转换图片')
    return doc.body.innerHTML
  }
}
async function importWord() {
  if (props.convert) {
    const result = await props.convert(file.value)
    handleResult(result)
  } else {
    const formData = new FormData()
    const config = JSON.stringify({
      collaboration_features: {
        comments: true,
        user_id: 'e3',
        track_changes: true,
      },
      formatting: {
        resets: 'none',
        defaults: 'inline',
        styles: 'inline',
        comments: 'basic',
      },
    })
    formData.append('config', config)
    formData.append('file', file.value)
    loading.value = true
    fetch('https://docx-converter.cke-cs.com/v2/convert/docx-html', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(async data => {
        handleResult(data.html)
      })
      .catch(error => {
        toast({
          title: '导入失败 文件不支持',
          variant: 'destructive',
        })
        console.error('Error:', error)
        loading.value = false
      })
  }
}
async function handleResult(htmlResult: string) {
  const html = await filerImage(htmlResult)
  console.log(html)
  props.editor.chain().setContent(html, true).run()
  loading.value = false
  toast({
    title: '导入成功!',
  })
}
</script>

<template>
  <div>
    <ActionButton :loading="loading" :disabled="disabled" :icon="icon" :tooltip="tooltip" :action="triggerFileInput" />
    <input type="file" accept=".docx" ref="fileInput" style="display: none" @change="handleFileChange" />
  </div>
</template>
