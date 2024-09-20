<script setup lang="ts">
import { computed, watch, onUnmounted, unref, useAttrs } from 'vue'
import { AnyExtension, Editor as CoreEditor, JSONContent } from '@tiptap/core'
import { Editor, EditorContent } from '@tiptap/vue-3'
import type { EditorOptions } from '@tiptap/vue-3'
import { EDITOR_UPDATE_THROTTLE_WAIT_TIME } from '@/constants'
import { differenceBy, getCssUnitWithDefault, hasExtension, isEqual, throttle } from '@/utils/utils'
import { useLocale } from '@/locales'
import { useProvideTiptapStore } from '@/hooks/useStore'
import BasicBubbleMenu from './menus/BasicBubbleMenu.vue'
import LinkBubbleMenu from './menus/LinkBubbleMenu.vue'
import TableBubbleMenu from './menus/TableBubbleMenu.vue'
import ContentMenu from './menus/ContentMenu.vue'
import ColumnsBubbleMenu from './menus/ColumnsBubbleMenu.vue'
import AIMenu from './menus/AIMenu.vue'
import Toolbar from './Toolbar.vue'
import { EchoEditorOnChange } from '@/type'
import { useDark, useToggle } from '@vueuse/core'
import Toaster from '@/components/ui/toast/Toaster.vue'

type KeyDownHandler = NonNullable<EditorOptions['editorProps']['handleKeyDown']>
type UpdateHandler = NonNullable<EditorOptions['onUpdate']>

interface EditorProps {
  modelValue?: string | object
  output?: 'html' | 'json' | 'text'
  dark?: boolean
  dense?: boolean
  disabled?: boolean
  hideToolbar?: boolean
  disableBubble?: boolean
  hideBubble?: boolean
  removeDefaultWrapper?: boolean
  maxWidth?: string | number
  minHeight?: string | number
  maxHeight?: string | number
  extensions?: AnyExtension[]
  editorClass?: string | string[] | Record<string, any>
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
  dense: false,
  disabled: false,
  hideToolbar: false,
  disableBubble: false,
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
const { state, isFullscreen } = useProvideTiptapStore()
const { t } = useLocale()
const isDark = useDark()

const sortExtensions = computed(() =>
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

watch(() => props.dark, useToggle(isDark))

const contentDynamicStyles = computed(() => ({
  ...(unref(isFullscreen)
    ? { height: '100%', overflowY: 'auto' as const }
    : {
        minHeight: getCssUnitWithDefault(props.minHeight),
        maxHeight: getCssUnitWithDefault(props.maxHeight),
        overflowY: 'auto' as const,
      }),
  maxWidth: getCssUnitWithDefault(props.maxWidth),
  width: props.maxWidth ? '100%' : undefined,
  margin: props.maxWidth ? '8px auto' : undefined,
}))

function getOutput(editor: CoreEditor, output: EditorProps['output']): string | JSONContent {
  if (editor.isEmpty && props.removeDefaultWrapper) {
    return output === 'json' ? {} : ''
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
        dense,
        'outline-primary': editor.isFocused,
        'outline-border': !editor.isFocused,
      },
    ]"
  >
    <ContentMenu :editor="editor" :disabled="disabled" />
    <LinkBubbleMenu :editor="editor" />
    <ColumnsBubbleMenu :editor="editor" />
    <TableBubbleMenu :editor="editor" />
    <AIMenu :editor="editor" :disabled="disabled" />
    <BasicBubbleMenu v-if="!hideBubble" :editor="editor" :disabled="disableBubble" />
    <div
      class="relative"
      :class="{ 'fixed bg-background inset-0 z-[200] w-full h-full m-0 rounded-none': isFullscreen }"
    >
      <Toolbar v-if="!hideToolbar" :editor="editor" :disabled="disabled" class="border-b py-1 px-1" />
      <editor-content :editor="editor" :class="contentClass" :style="contentDynamicStyles" />
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
