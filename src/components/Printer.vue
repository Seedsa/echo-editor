<script setup lang="ts">
import { useTiptapStore } from '@/hooks'
import type { Editor } from '@tiptap/core'
import ProseMirrorStyle from '@/styles/ProseMirror.scss?inline'
import GlobalStyle from '@/styles/global.scss?inline'
import { useHotkeys } from '@/hooks'
interface Props {
  editor: Editor
  disabled?: boolean
  containerRef: Object
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  containerRef: undefined,
})
const { state } = useTiptapStore()
const srcdoc = ref('')
const iframeRef = ref<HTMLIFrameElement | null>(null)

async function handlePrint() {
  props.editor.commands.blur()
  const content = props.editor.getHTML()
  srcdoc.value = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Echo Editor</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${ProseMirrorStyle} ${GlobalStyle}</style>
    </head>
    <body class="is-print">
      <div class="tiptap ProseMirror" translate="no" aria-expanded="false">
          ${content}
      </div>
    </body>
    </html>`
  await nextTick()
  setupPrintListener(iframeRef.value!)
  iframeRef?.value?.contentWindow?.print()
}
function setupPrintListener(iframe: HTMLIFrameElement) {
  if (!iframe.contentWindow) {
    console.error('无法访问 iframe 的 contentWindow')
    return
  }

  const iframeWindow = iframe.contentWindow

  // 监听 afterprint 事件（用于处理用户取消打印的情况）
  iframeWindow.addEventListener('afterprint', () => {
    state.printer = false
  })
}
watch(
  () => state.printer,
  val => {
    if (val) {
      handlePrint()
    }
  }
)
// 创建快捷键的绑定和解绑控制
const { bind, unbind } = useHotkeys('ctrl+p,command+p', () => {
  state.printer = true
})
// 当编辑器获得焦点时绑定快捷键，失去焦点时解绑快捷键
props.editor.on('focus', bind)
props.editor.on('blur', unbind)
</script>
<template>
  <iframe ref="iframeRef" v-if="state.printer" class="absolute w-0 h-0 border-none overflow-auto" :srcdoc="srcdoc" />
</template>
