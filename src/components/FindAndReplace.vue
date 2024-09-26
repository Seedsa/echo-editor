<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useElementBounding, useElementVisibility } from '@vueuse/core'
import { useTiptapStore } from '@/hooks'
import type { Editor } from '@tiptap/core'
import { useLocale } from '@/locales'

interface Props {
  editor: Editor
  disabled?: boolean
  containerRef: Object
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  containerRef: undefined,
})

const emit = defineEmits(['update:modelValue', 'find', 'replace'])
const dialogRef = ref<any>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const store = useTiptapStore()
const searchTerm = ref<string>('')
const replaceTerm = ref<string>('')
const caseSensitive = ref<boolean>(false)
const { t } = useLocale()
const computedAnchorElement: any = computed(() => props.containerRef)

const { focused } = useFocus(inputRef)

// 使用 useElementBounding 获取锚点元素的位置
const { top, right } = useElementBounding(computedAnchorElement)

// 使用 useElementVisibility 检测编辑器是否可见
const isEditorVisible = useElementVisibility(computedAnchorElement)

// 计算对话框位置
const position = ref({ x: 0, y: 0 })

// 监听锚点元素位置变化和可见性
watch([top, right, isEditorVisible], () => {
  if (isEditorVisible.value && dialogRef.value) {
    position.value = {
      y: top.value + 24,
      x: right.value - 320 - 24,
    }
  }
})
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

function handleFind(e) {
  e.preventDefault()
  next()
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
    } else {
      clear()
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
</script>

<template>
  <Teleport to="body">
    <div
      v-show="store.state.findAndReplace && isEditorVisible"
      ref="dialogRef"
      class="fixed bg-white shadow-lg rounded-lg p-4 w-[320px] border z-[11]"
      :style="{ top: `${position.y}px`, left: `${position.x}px` }"
    >
      <button
        @click="store.toggleFindAndReplace()"
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <Icon name="Close" />
      </button>
      <form @submit="handleFind" class="mt-1">
        <Label>{{ t('editor.findAndReplace.find') }}</Label>
        <div class="flex w-full max-w-sm items-center gap-1.5">
          <div class="relative w-full max-w-sm items-center">
            <Input v-model="searchTerm" class="pr-10" ref="inputRef" />
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
            <Button type="submit" variant="outline" size="icon" class="px-2.5">
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
          <Button type="submit">{{ t('editor.findAndReplace.find') }}</Button>
          <Button variant="secondary" @click="replace">{{ t('editor.findAndReplace.replace') }}</Button>
          <Button variant="secondary" @click="replaceAll">{{ t('editor.findAndReplace.replaceAll') }}</Button>
        </div>
      </form>
    </div>
  </Teleport>
</template>
