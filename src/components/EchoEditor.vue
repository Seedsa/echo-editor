<script setup lang="ts">
import { computed, watch, onUnmounted, unref, useAttrs, ref } from 'vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { AnyExtension, Editor as CoreEditor } from '@tiptap/core'
import { Editor, EditorContent } from '@tiptap/vue-3'
import type { EditorOptions } from '@tiptap/vue-3'
import { EDITOR_UPDATE_THROTTLE_WAIT_TIME, EDITOR_UPDATE_WATCH_THROTTLE_WAIT_TIME } from '@/constants'
import { differenceBy, getCssUnitWithDefault, hasExtension, isEqual, throttle } from '@/utils/utils'
import { useLocale } from '@/locales'
import { useProvideTiptapStore } from '@/hooks/useStore'
import BubbleMenu from './menus/BubbleMenu.vue'
import LinkBubbleMenu from './menus/LinkBubbleMenu.vue'
import TableBubbleMenu from '@/extensions/Table/menus/TableBubbleMenu.vue'
import ContentMenu from './menus/ContentMenu.vue'
import ColumnsMenu from '@/extensions/MultiColumn/menus'
import Toolbar from './Toolbar.vue'
import { EchoEditorOnChange } from '@/type'
import { useDark, useToggle, watchDebounced, debouncedRef } from '@vueuse/core'
import { TooltipProvider } from '@/components/ui/tooltip'

type HandleKeyDown = NonNullable<EditorOptions['editorProps']['handleKeyDown']>
type OnUpdate = NonNullable<EditorOptions['onUpdate']>

interface Props {
  modelValue?: string | object
  output?: 'html' | 'json' | 'text'
  dark?: boolean
  dense?: boolean
  disabled?: boolean
  label?: string
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

interface Emits {
  (event: 'enter'): void
  (event: 'change', value: EchoEditorOnChange): void
  (event: 'update:modelValue', value: Props['modelValue']): void
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  output: 'html',
  dark: undefined,
  dense: false,
  disabled: false,
  label: undefined,
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

const emit = defineEmits<Emits>()

const attrs = useAttrs()

const { state, isFullscreen } = useProvideTiptapStore()

const sortExtensions = computed<AnyExtension[]>(() => {
  const diff = differenceBy(props.extensions, state.extensions, 'name')
  const exts = state.extensions.map((k, i) => {
    const find = props.extensions.find(ext => ext.name === k.name)
    if (!find) return k
    return k.configure(find.options)
  })
  return [...exts, ...diff].map((k, i) => k.configure({ sort: i }))
})

const editor = new Editor({
  content: props.modelValue,
  editorProps: {
    handleKeyDown: throttle<HandleKeyDown>(function (view, event) {
      if (event.key === 'Enter' && attrs.enter && !event.shiftKey) {
        emit('enter')
        return true
      }

      return false
    }, EDITOR_UPDATE_THROTTLE_WAIT_TIME),
  },
  onUpdate: throttle<OnUpdate>(({ editor }) => {
    const output = getOutput(editor, props.output as any)
    emit('update:modelValue', output)
    emit('change', { editor, output })
  }, EDITOR_UPDATE_THROTTLE_WAIT_TIME),
  extensions: unref(sortExtensions),
  autofocus: false,
  editable: !props.disabled,
  injectCSS: true,
})
const { t } = useLocale()
const isDark = useDark()
watch(
  () => props.dark,
  val => {
    const toggle = useToggle(isDark)
    toggle(val)
  }
)

const contentDynamicStyles = computed(() => {
  const maxWidth = getCssUnitWithDefault(props.maxWidth)

  const maxHeightStyle = {
    maxWidth: maxWidth,
    width: !maxWidth ? undefined : '100%',
    margin: !maxWidth ? undefined : '8px auto',
  }
  if (unref(isFullscreen)) return { height: '100%', overflowY: 'auto', ...maxHeightStyle }

  const minHeight = getCssUnitWithDefault(props.minHeight)
  const maxHeight = getCssUnitWithDefault(props.maxHeight)

  return {
    minHeight,
    maxHeight,
    overflowY: 'auto',
    ...maxHeightStyle,
  }
})

function getOutput(editor: CoreEditor, output: Props['output']) {
  if (props.removeDefaultWrapper) {
    if (output === 'html') return editor.isEmpty ? '' : editor.getHTML()
    if (output === 'json') return editor.isEmpty ? {} : editor.getJSON()
    if (output === 'text') return editor.isEmpty ? '' : editor.getText()
    return ''
  }

  if (output === 'html') return editor.getHTML()
  if (output === 'json') return editor.getJSON()
  if (output === 'text') return editor.getText()
  return ''
}

const onValueChange = throttle((val: NonNullable<Props['modelValue']>) => {
  if (!editor) return

  const output = getOutput(editor, props.output as any)

  if (isEqual(output, val)) return

  const { from, to } = editor.state.selection
  editor.commands.setContent(val, false)
  editor.commands.setTextSelection({ from, to })
}, EDITOR_UPDATE_WATCH_THROTTLE_WAIT_TIME)

const onDisabledChange = (val: boolean) => editor?.setEditable(!val)

watch(() => props.modelValue, onValueChange)
watch(() => props.disabled, onDisabledChange)

onUnmounted(() => editor?.destroy())

defineExpose({ editor })
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <div
      v-if="editor"
      class="echo-editor rounded-[0.5rem] bg-background shadow overflow-hidden outline outline-1"
      :class="[editorClass, dense ? 'dense' : '', editor.isFocused ? 'outline-primary' : 'outline-border']"
    >
      <ContentMenu :editor="editor" />
      <LinkBubbleMenu :editor="editor" />
      <ColumnsMenu :editor="editor" />
      <TableBubbleMenu :editor="editor" />
      <BubbleMenu v-if="!hideBubble" :editor="editor" :disabled="disableBubble" />

      <div
        class="flex flex-col w-full max-h-full"
        :class="[isFullscreen && 'fixed inset-0 z-[200] w-full h-full m-0 rounded-none']"
      >
        <Toolbar v-if="!hideToolbar" :editor="editor" class="border-b py-2 px-1" />
        <editor-content :editor="editor" :class="contentClass" :style="contentDynamicStyles" />
        <slot name="footer" v-bind="{ editor }">
          <div v-if="hasExtension(editor, 'characterCount')" class="flex flex-col p-3 border-t">
            <div class="flex justify-end gap-3 text-sm">
              <template v-if="hasExtension(editor, 'characterCount')">
                <span>
                  {{ editor.storage.characterCount.characters() }}
                  {{ t('editor.characters') }}
                </span>
              </template>
            </div>
          </div></slot
        >
      </div>
      <Toaster />
    </div>
  </TooltipProvider>
</template>

<style lang="scss">
@import '@/styles/index.scss';
</style>
