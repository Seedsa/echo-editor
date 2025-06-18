<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Icon } from '@/components/icons'
import { useTiptapStore } from '@/hooks'
import { useLocale } from '@/locales'
import { computed, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import type { Editor } from '@tiptap/core'
import { createEditor, type PrismEditor } from 'prism-code-editor'
import { defaultCommands, editHistory } from 'prism-code-editor/commands'
import { cursorPosition } from 'prism-code-editor/cursor'
import { indentGuides } from 'prism-code-editor/guides'
import { highlightBracketPairs } from 'prism-code-editor/highlight-brackets'
import { matchBrackets } from 'prism-code-editor/match-brackets'
import { matchTags } from 'prism-code-editor/match-tags'
import { searchWidget } from 'prism-code-editor/search'
import 'prism-code-editor/search.css'
import 'prism-code-editor/guides.css'
import 'prism-code-editor/code-folding.css'
import 'prism-code-editor/layout.css'
import '@/extensions/CodeBlock/components/theme.css'
import 'prism-code-editor/languages/html'

import { useTheme } from '@/hooks/useTheme'

interface Props {
  editor: Editor
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const { isDark } = useTheme()

const containerRef = ref(null)
const { t } = useLocale()
const store = useTiptapStore()
const htmlCode = ref('')
let codeEditor = ref<PrismEditor | null>(null)

// 获取当前编辑器的 HTML 内容
const currentHtmlContent = computed(() => {
  return props.editor.getHTML()
})

// 关闭对话框
function handleClose() {
  store.state.sourceCode = false
}

// 保存编辑
function saveEdit() {
  try {
    // https://github.com/ueberdosis/tiptap/discussions/5675
    props.editor.commands.setContent(htmlCode.value, true)
    store.state.sourceCode = false
  } catch (error) {
    console.error('保存 HTML 代码时出错:', error)
  }
}

// 复制代码
function copyCode() {
  const codeToCopy = htmlCode.value
  if (codeToCopy) {
    navigator.clipboard
      .writeText(codeToCopy)
      .then(() => {
        console.log('HTML 代码已复制到剪贴板')
      })
      .catch(err => {
        console.error('复制失败:', err)
      })
  }
}

// 监听对话框状态，重置状态
watch(
  () => store.state.sourceCode,
  isOpen => {
    if (!isOpen) {
      // 对话框关闭时的清理工作
    } else {
      // 对话框打开时，初始化编辑内容
      nextTick(() => {
        init()
        codeEditor.value?.textarea.focus()
      })
    }
  }
)

function init() {
  htmlCode.value = currentHtmlContent.value
  codeEditor.value = createEditor(containerRef.value, {
    language: 'html',
    tabSize: 2,
    lineNumbers: true,
    wordWrap: true,
    value: htmlCode.value,
    onUpdate(value) {
      htmlCode.value = value
    },
  })
  codeEditor.value.addExtensions(
    matchBrackets(),
    matchTags(),
    indentGuides(),
    highlightBracketPairs(),
    cursorPosition(),
    defaultCommands(),
    editHistory(),
    searchWidget()
  )
}

onBeforeUnmount(() => {
  codeEditor.value?.remove()
})
</script>

<template>
  <Dialog :open="store?.state.sourceCode" @update:open="open => (store.state.sourceCode = open)">
    <DialogContent
      @close-auto-focus="e => e.preventDefault()"
      class="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh] h-full"
    >
      <DialogHeader class="p-6 pb-0">
        <DialogTitle>{{ t('editor.sourceCode.title') }}</DialogTitle>
      </DialogHeader>

      <div ref="containerRef" class="flex border mx-1" :class="` ${isDark ? 'atom-one-dark' : 'vs-code-light'}`" />
      <DialogFooter class="p-6 flex-shrink-0 pt-0 sm:justify-between">
        <div class="flex items-center gap-3">
          <Button variant="outline" size="sm" @click="copyCode">
            <Icon name="Copy" class="w-4 h-4 mr-1" />
            {{ t('editor.copy') }}
          </Button>
        </div>
        <div class="flex items-center gap-3">
          <Button size="sm" @click="handleClose" variant="outline">
            {{ t('editor.close') }}
          </Button>
          <Button size="sm" @click="saveEdit">
            <Icon name="Check" class="w-4 h-4 mr-1" />
            {{ t('editor.save') }}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
