<script setup lang="ts">
import { computed, watch, onUnmounted, unref, useAttrs } from 'vue'
import { AnyExtension, Editor as CoreEditor, JSONContent } from '@tiptap/core'
import { Editor, EditorContent } from '@tiptap/vue-3'
import type { EditorOptions } from '@tiptap/vue-3'
import { EDITOR_UPDATE_THROTTLE_WAIT_TIME } from '@/constants'
import { differenceBy, getCssUnitWithDefault, hasExtension, isEqual, throttle } from '@/utils/utils'
import { useLocale } from '@/locales'
import { useTiptapStore } from '@/hooks'
import BasicBubbleMenu from './menus/BasicBubbleMenu.vue'
import LinkBubbleMenu from './menus/LinkBubbleMenu.vue'
import TableBubbleMenu from './menus/TableBubbleMenu.vue'
import ContentMenu from './menus/ContentMenu.vue'
import ColumnsBubbleMenu from './menus/ColumnsBubbleMenu.vue'
import ImageBubbleMenu from './menus/ImageBubbleMenu.vue'
import AIMenu from './menus/AIMenu.vue'
import Menubars from './Menubars.vue'
import Toolbar from './Toolbar.vue'
import Preview from './Preview.vue'
import Printer from './Printer.vue'
import FindAndReplace from './FindAndReplace.vue'
import { EchoEditorOnChange } from '@/type'
import { useDark } from '@vueuse/core'
import Toaster from '@/components/ui/toast/Toaster.vue'

type KeyDownHandler = NonNullable<EditorOptions['editorProps']['handleKeyDown']>
type UpdateHandler = NonNullable<EditorOptions['onUpdate']>

interface EditorProps {
  /**
   * input value
   */
  modelValue?: string | object
  /**
   * Editor output type
   *
   * @default 'html'
   */
  output?: 'html' | 'json' | 'text'
  /**
   * dark mode
   *
   * @default false
   */
  dark?: boolean
  /**
   * Readonly
   *
   * @default false
   */
  disabled?: boolean
  /**
   * Hide Editor Toolbar
   *
   * @default false
   */
  hideToolbar?: boolean
  /**
   * Hide Editor Menubar
   *
   * @default false
   */
  hideMenubar?: boolean
  /**
   * Hide Editor Bubble Menu
   *
   * @default false
   */
  hideBubble?: boolean
  /**
   * Remove tiptap default wrapper when editor is empty eg. <p></p>
   *
   * @default false
   */
  removeDefaultWrapper?: boolean
  /**
   * Editor content maximum width
   */
  maxWidth?: string | number
  /**
   * Editor content minimum height
   */
  minHeight?: string | number
  /**
   * Editor content maximum height
   */
  maxHeight?: string | number
  /**
   * Tiptap extensions
   */
  extensions?: AnyExtension[]
  /**
   * Editor container class
   */
  editorClass?: string | string[] | Record<string, any>
  /**
   * Editor content class
   */
  contentClass?: string | string[] | Record<string, any>
}

interface EditorEmits {
  (event: 'enter'): void
  (event: 'change', value: EchoEditorOnChange): void
  (event: 'update:modelValue', value: EditorProps['modelValue']): void
}

const props = withDefaults(defineProps<EditorProps>(), {
  modelValue: '',
  output: 'html',
  dark: undefined,
  disabled: false,
  hideToolbar: false,
  hideMenubar: false,
  hideBubble: false,
  removeDefaultWrapper: false,
  maxWidth: undefined,
  minHeight: undefined,
  maxHeight: undefined,
  extensions: () => [],
  editorClass: undefined,
  contentClass: undefined,
})

const emit = defineEmits<EditorEmits>()

const attrs = useAttrs()
const { state, isFullscreen } = useTiptapStore()

const { t } = useLocale()
const isDark = useDark()
const contentRef = ref<HTMLElement | null>(null)

const sortExtensions = computed<AnyExtension[]>(() =>
  [...state.extensions, ...differenceBy(props.extensions, state.extensions, 'name')].map((k, i) =>
    k.configure({ sort: i })
  )
)

const editor = new Editor({
  content: props.modelValue,
  editorProps: {
    handleKeyDown: throttle<KeyDownHandler>((_, event) => {
      if (event.key === 'Enter' && attrs.enter && !event.shiftKey) {
        emit('enter')
        return true
      }
      return false
    }, EDITOR_UPDATE_THROTTLE_WAIT_TIME),
  },
  onUpdate: throttle<UpdateHandler>(({ editor }) => {
    const output = getOutput(editor, props.output)
    emit('update:modelValue', output)
    emit('change', { editor, output })
  }, EDITOR_UPDATE_THROTTLE_WAIT_TIME),
  extensions: unref(sortExtensions),
  editable: !props.disabled,
})

watch(
  () => props.dark,
  val => {
    if (val !== undefined) {
      isDark.value = val
    }
  }
)

const contentDynamicStyles = computed(() => ({
  ...(unref(isFullscreen)
    ? { height: '100%', overflowY: 'auto' as const }
    : {
        minHeight: getCssUnitWithDefault(props.minHeight),
        maxHeight: getCssUnitWithDefault(props.maxHeight),
        overflowY: 'auto' as const,
        scrollBehavior: 'smooth',
        scrollbarWidth: 'thin',
      }),
  maxWidth: getCssUnitWithDefault(props.maxWidth),
  width: props.maxWidth ? '100%' : undefined,
  margin: props.maxWidth ? '8px auto' : undefined,
}))

function getOutput(editor: CoreEditor, output: EditorProps['output']): string | JSONContent {
  if (props.removeDefaultWrapper) {
    if (output === 'html') return editor.isEmpty ? '' : editor.getHTML()
    if (output === 'json') return editor.isEmpty ? {} : editor.getJSON()
    if (output === 'text') return editor.isEmpty ? '' : editor.getText()
    return ''
  }
  switch (output) {
    case 'html':
      return editor.getHTML()
    case 'json':
      return editor.getJSON()
    case 'text':
      return editor.getText()
    default:
      return ''
  }
}

watch(
  () => props.modelValue,
  val => {
    if (!editor || isEqual(getOutput(editor, props.output), val)) return
    const { from, to } = editor.state.selection
    editor.commands.setContent(val, false)
    editor.commands.setTextSelection({ from, to })
  },
  { deep: true }
)

watch(
  () => props.disabled,
  val => editor?.setEditable(!val)
)

onUnmounted(() => editor?.destroy())

defineExpose({ editor })
</script>

<template>
  <div
    v-if="editor"
    class="echo-editor rounded-[0.5rem] bg-background shadow outline outline-1 relative"
    :class="[
      editorClass,
      {
        'outline-primary': editor.isFocused,
        'outline-border': !editor.isFocused,
      },
    ]"
  >
    <Preview :editor="editor" />
    <Printer :editor="editor" />
    <FindAndReplace :container-ref="contentRef" :editor="editor" />
    <div
      class="relative flex flex-col overflow-hidden"
      :class="{
        '!fixed bg-background inset-0 z-[10]  w-full h-full m-0 rounded-[0.5rem]': isFullscreen,
      }"
    >
      <Menubars v-if="!hideMenubar" :editor="editor" :disabled="disabled" />
      <Toolbar v-if="!hideToolbar" :editor="editor" :disabled="disabled" class="border-b py-1 px-1 overflow-hidden" />
      <div class="overflow-hidden relative flex-1">
        <editor-content
          ref="contentRef"
          :editor="editor"
          :class="contentClass"
          :style="contentDynamicStyles"
          :spellcheck="state.spellCheck"
        />
        <template v-if="!hideBubble && !disabled && editor.isEditable">
          <ContentMenu :editor="editor" class="hidden sm:block" />
          <LinkBubbleMenu :editor="editor" />
          <ColumnsBubbleMenu :editor="editor" />
          <TableBubbleMenu :editor="editor" />
          <AIMenu :editor="editor" />
          <ImageBubbleMenu :editor="editor" />
          <BasicBubbleMenu :editor="editor" />
        </template>
      </div>
      <div v-if="hasExtension(editor, 'characterCount')" class="flex justify-between border-t p-3 items-center">
        <div class="flex flex-col">
          <div class="flex justify-end gap-3 text-sm">
            <span>
              {{ editor.storage.characterCount.characters() }}
              {{ t('editor.characters') }}
            </span>
          </div>
        </div>
        <slot name="footer" :editor="editor" />
      </div>
    </div>
    <Toaster />
  </div>
</template>
