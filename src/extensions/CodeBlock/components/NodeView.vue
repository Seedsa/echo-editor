<template>
  <node-view-wrapper :id="node.attrs.id" class="echo-node-view my-4">
    <div
      ref="containerRef"
      :class="`relative ${isDark ? 'atom-one-dark' : 'vs-code-light'} w-full overflow-hidden rounded-sm outline-1 outline-solid outline-border outline`"
    >
      <div
        v-if="editor.isEditable"
        class="echo-code-block-toolbar bg-background text-foreground flex items-center justify-between z-10 p-1 border-b"
      >
        <div class="flex items-center gap-2">
          <TooltipProvider :delay-duration="0">
            <Tooltip>
              <TooltipTrigger class="w-[160px]">
                <Select v-model:model-value="node.attrs.language">
                  <SelectTrigger class="w-[160px] border-none shadow-none outline-none text-sm h-7">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent @close-auto-focus="e => e.preventDefault()">
                    <SelectItem v-for="lang in languages" :key="lang.value" :value="lang.value">
                      {{ lang.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent :side-offset="8">{{ t('editor.codeblock.selectLang') }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div class="flex items-center gap-2">
          <TooltipProvider :delay-duration="0">
            <Tooltip>
              <TooltipTrigger>
                <div @click="copyCode" class="h-7 w-7 rounded-sm flex justify-center items-center cursor-pointer">
                  <Icon name="Copy" class="w-4 h-4"></Icon>
                </div>
              </TooltipTrigger>
              <TooltipContent :side-offset="8">{{ t('editor.codeblock.copy') }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div class="toolbar-divider"></div>

          <TooltipProvider :delay-duration="0">
            <Tooltip>
              <TooltipTrigger>
                <div
                  @click="toggleLineNumbers"
                  class="h-7 w-7 rounded-sm flex justify-center items-center cursor-pointer"
                  :class="{ 'bg-accent': node.attrs.lineNumbers }"
                >
                  <Icon name="List" class="w-4 h-4"></Icon>
                </div>
              </TooltipTrigger>
              <TooltipContent :side-offset="8">{{ t('editor.codeblock.lineNumbers') }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div class="toolbar-divider"></div>

          <TooltipProvider :delay-duration="0">
            <Tooltip>
              <TooltipTrigger>
                <div
                  @click="toggleWordWrap"
                  class="h-7 w-7 rounded-sm flex justify-center items-center cursor-pointer"
                  :class="{ 'bg-accent': node.attrs.wordWrap }"
                >
                  <Icon name="WrapText" class="w-4 h-4"></Icon>
                </div>
              </TooltipTrigger>
              <TooltipContent :side-offset="8">{{ t('editor.codeblock.wordWrap') }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div class="toolbar-divider"></div>

          <TooltipProvider :delay-duration="0">
            <Tooltip>
              <TooltipTrigger>
                <Select v-model:model-value="node.attrs.tabSize">
                  <SelectTrigger class="w-[60px] border-none outline-none text-sm h-7">
                    <Icon name="IndentIncrease" class="w-4 h-4" />
                  </SelectTrigger>
                  <SelectContent @close-auto-focus="e => e.preventDefault()">
                    <SelectItem v-for="size in tabSizes" :key="size" :value="size">
                      {{ size }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent :side-offset="8">{{ t('editor.codeblock.tabSize') }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import 'prism-code-editor/prism/languages/bash'
import 'prism-code-editor/prism/languages/css'
import 'prism-code-editor/prism/languages/css-extras'
import 'prism-code-editor/prism/languages/markup'
import 'prism-code-editor/prism/languages/java'
import 'prism-code-editor/prism/languages/sql'
import 'prism-code-editor/prism/languages/cpp'
import 'prism-code-editor/prism/languages/go'
import 'prism-code-editor/prism/languages/javascript'
import 'prism-code-editor/prism/languages/js-templates'
import 'prism-code-editor/prism/languages/jsx'
import 'prism-code-editor/prism/languages/python'
import 'prism-code-editor/prism/languages/rust'
import 'prism-code-editor/prism/languages/clike'
import 'prism-code-editor/prism/languages/json'
import 'prism-code-editor/prism/languages/typescript'
import 'prism-code-editor/prism/languages/tsx'
import 'prism-code-editor/prism/languages/yaml'
import 'prism-code-editor/layout.css'
import './theme.css'

import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { createEditor, type PrismEditor } from 'prism-code-editor'
import { defaultCommands, editHistory } from 'prism-code-editor/commands'
import { cursorPosition } from 'prism-code-editor/cursor'

import { indentGuides } from 'prism-code-editor/guides'
import { highlightBracketPairs } from 'prism-code-editor/highlight-brackets'
import { matchBrackets } from 'prism-code-editor/match-brackets'
import { matchTags } from 'prism-code-editor/match-tags'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useLocale } from '@/locales'
import { useTiptapStore } from '@/hooks'
import { useTheme } from '@/hooks/useTheme'

const props = defineProps(nodeViewProps)

const { t } = useLocale()

const containerRef = ref(null)

const { state } = useTiptapStore()
const { isDark } = useTheme()
const code = ref(props.node.attrs.code || props.node.textContent || '')
let codeEditor = ref<PrismEditor | null>(null)

const languages = [
  { value: 'plaintext', label: 'plaintext' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bash', label: 'Bash' },
  { value: 'php', label: 'PHP' },
]

const tabSizes = [2, 4, 8]
const copyCode = () => {
  if (code.value) {
    navigator.clipboard
      .writeText(code.value)
      .then(() => {
        console.log('代码已复制到剪贴板')
      })
      .catch(err => {
        console.error('复制失败:', err)
      })
  }
}

const toggleLineNumbers = () => {
  props.updateAttributes({
    lineNumbers: !props.node.attrs.lineNumbers,
  })
}

const toggleWordWrap = () => {
  props.updateAttributes({
    wordWrap: !props.node.attrs.wordWrap,
  })
}

const validateAndUpdateLanguage = (attrs: any) => {
  const validatedAttrs = { ...attrs }
  if (validatedAttrs.language && !languages.some(lang => lang.value === validatedAttrs.language)) {
    validatedAttrs.language = 'plaintext'
    props.updateAttributes({
      language: 'plaintext',
    })
  }

  return validatedAttrs
}

onMounted(() => {
  const attrs = validateAndUpdateLanguage(props.node.attrs)
  codeEditor.value = createEditor(containerRef.value, {
    readOnly: state.disabled,
    language: attrs.language || 'plaintext',
    tabSize: attrs.tabSize ?? 2,
    lineNumbers: attrs.lineNumbers ?? true,
    wordWrap: attrs.wordWrap ?? false,
    value: code.value,
    rtl: false,
    onUpdate(value) {
      props.updateAttributes({ code: value })
    },
  })
  codeEditor.value.addExtensions(
    matchBrackets(),
    matchTags(),
    indentGuides(),
    highlightBracketPairs(),
    cursorPosition(),
    defaultCommands(),
    editHistory()
  )

  if (props.node.attrs.shouldFocus) {
    nextTick(() => {
      codeEditor.value?.textarea.focus()
      props.updateAttributes({
        shouldFocus: false,
      })
    })
  }
})
onBeforeUnmount(() => {
  codeEditor.value?.remove()
})

watch(
  () => state.disabled,
  (val: boolean) => {
    codeEditor.value?.setOptions({
      readOnly: val,
    })
  }
)
watch(
  () => [props.node.attrs.language, props.node.attrs.lineNumbers, props.node.attrs.wordWrap, props.node.attrs.tabSize],
  () => {
    const attrs = validateAndUpdateLanguage(props.node.attrs)
    codeEditor.value?.setOptions(attrs)
  }
)
</script>

<style lang="scss">
.toolbar-divider {
  @apply bg-gray-400;
  width: 1px;
  height: 16px;
  margin: 0 4px;
}

.prism-code-editor {
  max-height: 560px;
  font-size: 14px;
  textarea {
    @apply caret-primary;
  }
  textarea[aria-readonly='true'] {
    caret-color: transparent;
  }
}
</style>
