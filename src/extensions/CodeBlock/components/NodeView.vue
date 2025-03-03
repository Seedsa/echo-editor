<template>
  <node-view-wrapper :id="node.attrs.id" class="echo-node-view my-8">
    <div ref="containerRef" class="echo-node-container echo-hover-shadow echo-select-outline echo-node-code-block">
      <div v-if="editor.isEditable" class="echo-code-block-toolbar">
        <TooltipProvider :delay-duration="0">
          <Tooltip>
            <TooltipTrigger class="w-[160px]">
              <Select v-model:model-value="node.attrs.language">
                <SelectTrigger class="w-[160px] border-none outline-none text-sm h-7 hover:bg-[#5a5d5e4f]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent
                  class="bg-[#21252b] text-[#ccc] border-[#3a3f4b]"
                  @close-auto-focus="e => e.preventDefault()"
                >
                  <SelectItem
                    class="focus:bg-[#5a5d5e4f] focus:text-[#fff]"
                    v-for="lang in languages"
                    :key="lang.value"
                    :value="lang.value"
                  >
                    {{ lang.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </TooltipTrigger>
            <TooltipContent :side-offset="5">{{ t('editor.codeblock.selectLang') }}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div class="toolbar-divider"></div>

        <TooltipProvider :delay-duration="0">
          <Tooltip>
            <TooltipTrigger>
              <div
                @click="copyCode"
                class="h-7 w-7 hover:bg-[#5a5d5e4f] rounded-sm flex justify-center items-center cursor-pointer"
              >
                <Icon name="Copy" class="w-4 h-4"></Icon>
              </div>
            </TooltipTrigger>
            <TooltipContent :side-offset="5">{{ t('editor.codeblock.copy') }}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div class="toolbar-divider"></div>

        <TooltipProvider :delay-duration="0">
          <Tooltip>
            <TooltipTrigger>
              <div
                @click="toggleLineNumbers"
                class="h-7 w-7 hover:bg-[#5a5d5e4f] rounded-sm flex justify-center items-center cursor-pointer"
                :class="{ 'bg-[#5a5d5e4f]': node.attrs.lineNumbers }"
              >
                <Icon name="List" class="w-4 h-4"></Icon>
              </div>
            </TooltipTrigger>
            <TooltipContent :side-offset="5">{{ t('editor.codeblock.lineNumbers') }}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div class="toolbar-divider"></div>

        <TooltipProvider :delay-duration="0">
          <Tooltip>
            <TooltipTrigger>
              <div
                @click="toggleWordWrap"
                class="h-7 w-7 hover:bg-[#5a5d5e4f] rounded-sm flex justify-center items-center cursor-pointer"
                :class="{ 'bg-[#5a5d5e4f]': node.attrs.wordWrap }"
              >
                <Icon name="WrapText" class="w-4 h-4"></Icon>
              </div>
            </TooltipTrigger>
            <TooltipContent :side-offset="5">{{ t('editor.codeblock.wordWrap') }}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div class="toolbar-divider"></div>

        <TooltipProvider :delay-duration="0">
          <Tooltip>
            <TooltipTrigger>
              <Select v-model:model-value="node.attrs.tabSize">
                <SelectTrigger class="w-[60px] border-none outline-none text-sm h-7 hover:bg-[#5a5d5e4f]">
                  <SelectValue :placeholder="node.attrs?.tabSize.toString() ?? ''" />
                </SelectTrigger>
                <SelectContent
                  class="bg-[#21252b] text-[#ccc] border-[#3a3f4b]"
                  @close-auto-focus="e => e.preventDefault()"
                >
                  <SelectItem
                    class="focus:bg-[#5a5d5e4f] focus:text-[#fff]"
                    v-for="size in tabSizes"
                    :key="size"
                    :value="size"
                  >
                    {{ size }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </TooltipTrigger>
            <TooltipContent :side-offset="5">{{ t('editor.codeblock.tabSize') }}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import 'prism-code-editor/prism/languages/bash'
import 'prism-code-editor/prism/languages/css'
import 'prism-code-editor/prism/languages/css-extras'
import 'prism-code-editor/prism/languages/ini'
import 'prism-code-editor/prism/languages/kotlin'
import 'prism-code-editor/prism/languages/xml'
import 'prism-code-editor/prism/languages/markup'
import 'prism-code-editor/prism/languages/r'
import 'prism-code-editor/prism/languages/basic'
import 'prism-code-editor/prism/languages/vbnet'
import 'prism-code-editor/prism/languages/c'
import 'prism-code-editor/prism/languages/opencl'
import 'prism-code-editor/prism/languages/diff'
import 'prism-code-editor/prism/languages/java'
import 'prism-code-editor/prism/languages/less'
import 'prism-code-editor/prism/languages/objectivec'
import 'prism-code-editor/prism/languages/ruby'
import 'prism-code-editor/prism/languages/sql'
import 'prism-code-editor/prism/languages/wasm'
import 'prism-code-editor/prism/languages/cpp'
import 'prism-code-editor/prism/languages/go'
import 'prism-code-editor/prism/languages/javascript'
import 'prism-code-editor/prism/languages/js-templates'
import 'prism-code-editor/prism/languages/jsx'
import 'prism-code-editor/prism/languages/lua'
import 'prism-code-editor/prism/languages/perl'
import 'prism-code-editor/prism/languages/python'
import 'prism-code-editor/prism/languages/rust'
import 'prism-code-editor/prism/languages/swift'
import 'prism-code-editor/prism/languages/clike'
import 'prism-code-editor/prism/languages/csharp'
import 'prism-code-editor/prism/languages/graphql'
import 'prism-code-editor/prism/languages/json'
import 'prism-code-editor/prism/languages/makefile'
import 'prism-code-editor/prism/languages/scss'
import 'prism-code-editor/prism/languages/typescript'
import 'prism-code-editor/prism/languages/tsx'
import 'prism-code-editor/prism/languages/yaml'
import 'prism-code-editor/prism/languages/regex'
import 'prism-code-editor/layout.css'

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

const props = defineProps(nodeViewProps)

const { t } = useLocale()

const containerRef = ref(null)

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

onMounted(() => {
  codeEditor.value = createEditor(containerRef.value, {
    readOnly: !props.editor.isEditable,
    language: props.node.attrs.language || 'plaintext',
    tabSize: props.node.attrs.tabSize ?? 2,
    lineNumbers: props.node.attrs.lineNumbers ?? true,
    wordWrap: props.node.attrs.wordWrap ?? false,
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
  () => props.editor.isEditable,
  (val: boolean) => {
    codeEditor.value?.setOptions({
      readOnly: val,
    })
  }
)
watch(
  () => [props.node.attrs.language, props.node.attrs.lineNumbers, props.node.attrs.wordWrap, props.node.attrs.tabSize],
  () => {
    codeEditor.value?.setOptions(props.node.attrs)
  }
)
</script>

<style lang="scss">
.echo-node-view {
  --editor__bg: #292c33;
  --widget__border: #3a3f4b;
  --widget__bg: #21252b;
  --widget__color: #ccc;
  --widget__color-active: #fff;
  --widget__color-options: #b2b2b2;
  --widget__bg-input: #1b1d23;
  --widget__bg-hover: #5a5d5e4f;
  --widget__bg-active: #336699;
  --widget__focus-ring: #5299e0;
  --search__bg-find: #528bff3d;
  --widget__bg-error: #5a1d1d;
  --widget__error-ring: #be1100;
  --editor__bg-highlight: #99bbff0a;
  --editor__bg-selection-match: #4a566d66;
  --editor__line-number: #636d83;
  --editor__bg-scrollbar: 220, 13%, 41%;
  --editor__bg-fold: #c5c5c5;
  --bg-guide-indent: #abb2bf26;
  --pce-ac-icon-class: #ee9d28;
  --pce-ac-icon-enum: #ee9d28;
  --pce-ac-icon-function: #b180d7;
  --pce-ac-icon-interface: #75beff;
  --pce-ac-icon-variable: #75beff;

  .echo-node-code-block {
    width: 100%;
    outline: solid 1px black;
    overflow: hidden;
    border-radius: 4px;
    position: relative;
  }

  .echo-code-block-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 10;
    padding: 4px;
    background-color: var(--editor__bg);
    color: var(--widget__color);
    border-bottom: 1px solid var(--widget__border);

    .toolbar-divider {
      width: 1px;
      height: 16px;
      background-color: var(--widget__border);
      margin: 0 4px;
    }
  }
}

.prism-code-editor {
  max-height: 560px;
  font-size: 14px;
  textarea {
    caret-color: var(--echo-color-black);
  }
  textarea[aria-readonly='true'] {
    caret-color: transparent;
  }
}

[contenteditable='false'] {
  .echo-node-code-block {
    outline: solid 1px var(--echo-content-node-border);
  }
}

// atom one dark
.prism-code-editor {
  caret-color: #528bff;
  font-family: 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace;

  color-scheme: dark;
}

/* Selection */
.prism-code-editor textarea::selection {
  background: #3e4451;
  color: #0000;
}

.pce-matches .match {
  --search__bg-find: #515c6a;
}

.active-line {
  --editor__line-number: #abb2bf;
}

.guide-indents .active {
  --bg-guide-indent: #abb2c280;
}

.token.comment,
.token.prolog,
.token.cdata {
  color: #5c6370;
}

[class*='language-'],
.token.punctuation,
.token.attr-equals,
.language-css .token.property {
  color: #abb2bf;
}

.token.keyword,
.token.token.anchor,
.token.regex-flags,
.selector .punctuation,
.selector .combinator,
.selector .operator,
.token.token.arrow {
  color: #c678dd;
}

.token.class-name,
.token.maybe-class-name {
  color: #e5c07b;
}

.token.attr-name,
.token.doctype,
.selector .class,
.selector .pseudo-element,
.selector .pseudo-class,
.token.regex .escape,
.token.char-class,
.token.char-set,
.token.boolean,
.token.constant,
.token.number,
.token.entity,
.token.unit,
.token.atrule,
.token.keyword-null,
.token.keyword-undefined {
  color: #d19a66;
}

.token.property,
.token.tag,
.token.doctype-tag,
.token.symbol,
.token.deleted,
.token.important,
.token.keyword-this,
.token.this .token.variable,
.token.selector,
.language-css .variable,
.token.property-access {
  color: #e06c75;
}

.token.string,
.token.char,
.token.inserted,
.token.string-property,
.token.attr-value,
.token.string.url,
.token.attr-value > .punctuation,
.token.code-snippet.code {
  color: #98c379;
}

.language-markdown .url > .variable,
.language-markdown .url > .content,
.token.function,
.token.selector .id {
  color: #61afef;
}

.token.url,
.token.regex,
.language-regex,
.token.char-class .operator,
.token.alternation,
.token.quantifier,
.token.hexcode,
.token.keyword-get,
.token.keyword-set,
.token.builtin,
.token.operator {
  color: #56b6c2;
}

/* Language overrides */

.language-css .token.important,
.token.atrule .token.rule,
.language-markdown .italic {
  color: #c678dd;
}

.language-json .token.keyword-null,
.language-markdown .bold * {
  color: #d19a66;
}

.language-markdown .code.keyword,
.language-json .token.operator,
.language-markdown .token.url,
.language-markdown .url > .operator,
.language-markdown .token.url-reference > .string {
  color: #abb2bf;
}

.language-css .function,
.language-markdown .token.blockquote.punctuation,
.language-markdown .token.hr.punctuation,
.language-markdown .token.url > .token.url,
.language-markdown .token.url-reference.url {
  color: #56b6c2;
}

.language-markdown .strike *,
.language-markdown .token.list.punctuation,
.language-markdown .token.title.important > .token.punctuation {
  color: #e06c75;
}

/* General */
.token.bold {
  font-weight: bold;
}

.token.comment,
.token.italic {
  font-style: italic;
}

.token.namespace {
  opacity: 0.8;
}

/* Brackets */

.token.bracket-level-0,
.token.bracket-level-3,
.token.bracket-level-6,
.token.bracket-level-9 {
  color: #ffd700;
}

.token.bracket-level-1,
.token.bracket-level-4,
.token.bracket-level-7,
.token.bracket-level-10 {
  color: #da70d6;
}

.token.bracket-level-2,
.token.bracket-level-5,
.token.bracket-level-8,
.token.bracket-level-11 {
  color: #179fff;
}

.token.interpolation-punctuation {
  color: #98c379;
}

.token.bracket-error {
  color: #ff1212cc;
}

.token.markup-bracket,
.token.regex .punctuation {
  color: inherit;
}

.active-bracket {
  box-shadow:
    inset 0 0 0 1px #888,
    inset 0 0 0 9in #0064001a;
}

.active-tagname,
.word-matches span {
  background: #575757b8;
}
</style>
