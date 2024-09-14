<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3'
import { useLocale } from '@/locales'
import { useTiptapStore } from '@/hooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AiCompletion from './components/AiCompletion.vue'
import { useFocus } from '@vueuse/core'
import { useToast } from '@/components/ui/toast/use-toast'
import { Icon } from '@/components/icons'
interface Props {
  editor: Editor
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const store = useTiptapStore()
const result = ref<string>('')
const status = ref<'init' | 'generating' | 'completed'>('init')
const prompt = ref<string>('')
const cachedPrompt = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)
const { focused } = useFocus(inputRef)
const currentRequest = ref<AbortController | null>(null)
const resultContainer = ref<HTMLElement | null>(null)
const { t } = useLocale()
const isShaking = ref<boolean>(false)
const { toast } = useToast()
let tippyInstance = ref<any>(null)

function getSelectionText(editor: Editor): string {
  const { from, to, empty } = editor.state.selection
  if (empty) {
    return ''
  }
  return editor.state.doc.textBetween(from, to, '')
}

function scrollToBottom() {
  if (resultContainer.value) {
    resultContainer.value.scrollTop = resultContainer.value.scrollHeight
  }
}

async function handleGenerate() {
  status.value = 'generating'
  result.value = ''
  const selectionText = getSelectionText(props.editor)
  // AbortController to cancel request
  currentRequest.value = new AbortController()
  const AIOptions = props.editor.extensionManager.extensions.find(e => e.name === 'AI')?.options
  try {
    const stream = await AIOptions.completions(prompt.value, selectionText, currentRequest.value.signal)
    if (!stream) {
      throw new Error('Failed to create stream')
    }
    for await (const chunk of stream) {
      if (currentRequest.value.signal.aborted) {
        console.log('Request aborted')
        break
      }
      result.value += chunk.choices[0]?.delta?.content || ''
      await nextTick()
      scrollToBottom()
    }
    cachedPrompt.value = prompt.value
    prompt.value = ''
    status.value = 'completed'
    await nextTick()
    focused.value = true
    scrollToBottom()
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.log('Request aborted')
    } else {
      toast({
        title: error?.message || 'Failed to generate AI completion',
        variant: 'destructive',
      })
    }
    handleClose()
  } finally {
    currentRequest.value = null
  }
}
const tippyOptions = reactive<Record<string, unknown>>({
  maxWidth: 600,
  zIndex: 99,
  appendTo: 'parent',
  onShow(instance) {
    tippyInstance.value = instance
    setTimeout(() => {
      focused.value = true
    }, 10)
  },
  onHide() {
    handleClose()
  },
  onDestroy() {
    tippyInstance.value = null
  },
})

watch(
  () => [store!.state.AIMenu],
  visible => {
    tippyInstance.value?.setProps({
      placement: visible.includes(true) ? 'bottom' : 'top',
    })
  }
)
const shouldShow: any = computed(() => {
  return store?.state.AIMenu
})

function handleClose() {
  if (currentRequest.value) {
    currentRequest.value.abort()
    currentRequest.value = null
  }
  store!.state.AIMenu = false
  result.value = ''
  prompt.value = ''
  status.value = 'init'
}
function handleReGenerate() {
  prompt.value = cachedPrompt.value
  handleGenerate()
}
// function to handle overlay click
function handleOverlayClick(): void {
  if (status.value === 'init' && prompt.value === '') {
    handleClose()
    return
  }
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 820) // Duration of the shake animation + a little extra
}
</script>
<template>
  <div class="absolute inset-0 top-0 left-0 right-0 bottom-0 z-[98]" v-show="shouldShow" @click="handleOverlayClick">
    <BubbleMenu v-show="shouldShow" :editor="editor" :tippy-options="tippyOptions">
      <div class="relative min-w-96 z-[99]" :class="{ 'shake-animation': isShaking }">
        <div
          class="border rounded-sm shadow-sm bg-background"
          v-show="status === 'generating' || status === 'completed'"
        >
          <div ref="resultContainer" class="p-4 line-height-none block overflow-y-auto" style="max-height: 270px">
            <div class="text-sm text-foreground line-height-snug" v-html="result" />
          </div>
        </div>
        <form @submit="handleGenerate" class="relative w-full max-w-sm items-center flex bg-background mt-3 rounded-md">
          <div
            v-if="status === 'generating'"
            class="text_loading_animation border w-full rounded-md pl-10 pr-20 h-12 py-1 flex items-center text-sm text-foreground"
          >
            {{ t('editor.AI.generating') }}
          </div>
          <Input
            v-model="prompt"
            ref="inputRef"
            v-else
            :placeholder="t('editor.AI.placeholder')"
            class="pl-10 pr-20 h-12 outline-none ring-0 focus-visible:ring-0"
          />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Icon name="Sparkles" class="w-5 h-5" />
          </span>
          <Button
            variant="secondary"
            class="absolute end-0 inset-y-0 flex items-center justify-center px-2 h-[32px] m-2"
            v-if="status === 'generating'"
            @click="handleClose"
          >
            {{ t('editor.AI.stop') }}
          </Button>
          <Button
            :disabled="!prompt"
            v-else
            @click="handleGenerate"
            class="absolute end-0 inset-y-0 flex items-center justify-center px-2 w-[32px] h-[32px] m-2"
          >
            <Icon name="ChevronRight" class="w-5 h-5" />
          </Button>
        </form>
        <AiCompletion
          @close="handleClose"
          @generate="handleReGenerate"
          v-if="status === 'completed' && prompt === ''"
          :editor="editor"
          :completion="result"
        />
      </div>
    </BubbleMenu>
  </div>
</template>

<style lang="scss" scoped>
@keyframes text-loading {
  0% {
    content: '·';
  }
  33% {
    content: '··';
  }
  66% {
    content: '···';
  }
}

.text_loading_animation::after {
  content: '·';
  margin-left: 8px;
  animation: text-loading 2s infinite;
}
.shake-animation {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
