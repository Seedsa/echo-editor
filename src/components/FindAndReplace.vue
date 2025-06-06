<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { useTiptapStore } from '@/hooks'
import type { Editor } from '@tiptap/core'
import { useLocale } from '@/locales'
import { useHotkeys } from '@/hooks'
import { getSelectionText } from '@/utils/content'

interface Props {
  editor: Editor
  disabled?: boolean
  containerRef: HTMLElement | null
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  containerRef: undefined,
})

const emit = defineEmits(['update:modelValue', 'find', 'replace'])
const inputRef = ref<HTMLInputElement | null>(null)
const store = useTiptapStore()
const searchTerm = ref<string>('')
const replaceTerm = ref<string>('')
const caseSensitive = ref<boolean>(false)
const { t } = useLocale()

const { focused } = useFocus(inputRef)

const resultLength = computed(() => props.editor?.storage.findAndReplace?.results.length || 0)

const updateSearchReplace = (clearIndex: boolean = false) => {
  if (!props.editor) return

  if (clearIndex) props.editor.commands.resetIndex()

  props.editor.commands.setSearchTerm(searchTerm.value)
  props.editor.commands.setReplaceTerm(replaceTerm.value)
  props.editor.commands.setCaseSensitive(caseSensitive.value)
}

const goToSelection = () => {
  if (!props.editor) return
  const { results, resultIndex } = props.editor.storage.findAndReplace
  const position: number | Range = results[resultIndex]
  if (!position) return
  //@ts-ignore
  props.editor.commands.setTextSelection(position)
  const { node } = props.editor.view.domAtPos(props.editor.state.selection.anchor)
  node instanceof HTMLElement && node.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

watch(
  () => searchTerm.value.trim(),
  (val, oldVal) => {
    if (!val) clear()
    if (val !== oldVal) updateSearchReplace(true)
  }
)

watch(
  () => replaceTerm.value.trim(),
  (val, oldVal) => (val === oldVal ? null : updateSearchReplace())
)

watch(
  () => caseSensitive.value,
  (val, oldVal) => (val === oldVal ? null : updateSearchReplace(true))
)
watch(
  () => store.state.findAndReplace,
  async val => {
    if (val) {
      await nextTick()
      focused.value = true
      searchTerm.value = getSelectionText(props.editor) || ''
      bindEsc()
    } else {
      clear()
      unbindEsc()
    }
  }
)
const replace = () => {
  props.editor.commands.replace()
  goToSelection()
}

const next = () => {
  props.editor.commands.nextSearchResult()
  goToSelection()
}

const previous = e => {
  e.preventDefault()
  props.editor.commands.previousSearchResult()
  goToSelection()
}

const clear = () => {
  searchTerm.value = replaceTerm.value = ''
  props.editor.commands.resetIndex()
}

const replaceAll = () => props.editor.commands.replaceAll()
function handleChange(e) {
  caseSensitive.value = e
}
onMounted(() => setTimeout(updateSearchReplace))

const { bind, unbind } = useHotkeys('ctrl+f,command+f', () => {
  store.state.findAndReplace = true
})

const { bind: bindEsc, unbind: unbindEsc } = useHotkeys('escape', () => {
  if (store.state.findAndReplace) {
    store.state.findAndReplace = false
  }
})

props.editor.on('focus', () => {
  bind()
})
props.editor.on('blur', () => {
  unbind()
})
</script>

<template>
  <div
    v-if="store.state.findAndReplace"
    class="findAndReplaceDialog echo-editor absolute bg-white shadow-lg rounded-lg p-4 w-[320px] border z-[11]"
    style="right: 12px; top: 12px"
  >
    <button
      @click="store.toggleFindAndReplace()"
      class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
    >
      <Icon name="Close" />
    </button>
    <Label>{{ t('editor.findAndReplace.find') }}</Label>
    <div class="flex w-full max-w-sm items-center gap-1.5">
      <div class="relative w-full max-w-sm items-center">
        <Input v-model="searchTerm" @keyup.enter="next" class="pr-10" ref="inputRef" />
        <span class="absolute end-0 inset-y-0 flex items-center justify-center px-2 text-sm">
          {{
            editor?.storage?.findAndReplace?.results.length
              ? editor?.storage?.findAndReplace?.resultIndex + 1
              : editor?.storage?.findAndReplace?.resultIndex
          }}
          /
          {{ editor?.storage?.findAndReplace?.results.length }}
        </span>
      </div>
      <div class="flex gap-1">
        <Button @click="previous" variant="outline" size="icon" class="px-2.5">
          <Icon name="ChevronUp" class="w-5 h-5" />
        </Button>
        <Button @click="next" variant="outline" size="icon" class="px-2.5">
          <Icon name="ChevronDown" class="w-5 h-5" />
        </Button>
      </div>
    </div>
    <Label>{{ t('editor.findAndReplace.replace') }}</Label>
    <Input v-model="replaceTerm" />
    <div class="flex items-center space-x-2 mt-2">
      <Checkbox id="terms" :checked="caseSensitive" @update:checked="handleChange" />
      <label
        for="terms"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {{ t('editor.findAndReplace.caseSensitive') }}
      </label>
    </div>
    <div class="flex gap-3 mt-3">
      <Button type="submit" :disabled="!resultLength">{{ t('editor.findAndReplace.find') }}</Button>
      <Button variant="secondary" @click="replace" :disabled="!editor.isEditable || !resultLength">{{
        t('editor.findAndReplace.replace')
      }}</Button>
      <Button variant="secondary" @click="replaceAll" :disabled="!editor.isEditable || !resultLength">{{
        t('editor.findAndReplace.replaceAll')
      }}</Button>
    </div>
  </div>
</template>
