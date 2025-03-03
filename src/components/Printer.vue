<script setup lang="ts">
import { useTiptapStore } from '@/hooks'
import type { Editor } from '@tiptap/core'
import { useHotkeys } from '@/hooks'

interface Props {
  editor: Editor
  disabled?: boolean
}
const getStylesHtml = () => {
  const styleSheets = Array.from(document.styleSheets)
  let proseMirrorStyles = ''

  styleSheets.forEach(sheet => {
    try {
      const rules = Array.from(sheet.cssRules || [])
      rules.forEach(rule => {
        if (rule instanceof CSSStyleRule) {
          if (rule.selectorText.includes('.EchoContentView')) {
            proseMirrorStyles += rule.cssText + '\n'
          }
        }
      })
    } catch (e) {
      // 跨域样式表可能会抛出安全错误，忽略这些错误
      console.warn('无法读取样式表:', e)
    }
  })

  // 获取内联样式标签中的样式
  const styleElements = Array.from(document.querySelectorAll('style'))
  styleElements.forEach(style => {
    const styleContent = style.textContent || ''
    if (styleContent.includes('.EchoContentView')) {
      proseMirrorStyles += styleContent + '\n'
    }
  })

  return proseMirrorStyles
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const { state } = useTiptapStore()
const srcdoc = ref('')
const iframeRef = ref<HTMLIFrameElement | null>(null)

// 生成打印内容的 HTML
function generatePrintHTML(content: string): string {
  console.log(getStylesHtml())
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Echo Editor</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${getStylesHtml()}</style>
    </head>
    <body class="echo-editor">
      <div class="tiptap EchoContentView" translate="no" aria-expanded="false">
          ${content}
      </div>
    </body>
    </html>`
}

// 设置打印监听器
function setupPrintListener(iframe: HTMLIFrameElement) {
  const iframeWindow = iframe.contentWindow
  if (!iframeWindow) {
    console.error('无法访问 iframe 的 contentWindow')
    return
  }

  const handleAfterPrint = () => {
    state.printer = false
    iframeWindow.removeEventListener('afterprint', handleAfterPrint)
  }

  iframeWindow.addEventListener('afterprint', handleAfterPrint)
}

// 处理打印操作
async function handlePrint() {
  try {
    props.editor.commands.blur()
    const content = props.editor.getHTML()
    srcdoc.value = generatePrintHTML(content)

    await nextTick()

    const iframe = iframeRef.value
    if (!iframe) {
      throw new Error('iframe 元素未找到')
    }

    setupPrintListener(iframe)
    iframe.contentWindow?.print()
  } catch (error) {
    console.error('打印过程中发生错误:', error)
    state.printer = false
  }
}

// 监听打印状态变化
watch(
  () => state.printer,
  val => {
    if (val && !props.disabled) {
      handlePrint()
    }
  }
)

// 设置快捷键
const { bind, unbind } = useHotkeys('ctrl+p,command+p', (e: KeyboardEvent) => {
  e.preventDefault()
  if (!props.disabled) {
    state.printer = true
  }
})

// 绑定编辑器事件
onMounted(() => {
  props.editor.on('focus', bind)
  props.editor.on('blur', unbind)
})

onUnmounted(() => {
  props.editor.off('focus', bind)
  props.editor.off('blur', unbind)
})
</script>

<template>
  <iframe ref="iframeRef" v-if="state.printer" class="absolute w-0 h-0 border-none overflow-auto" :srcdoc="srcdoc" />
</template>
