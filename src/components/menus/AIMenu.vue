<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3'
import { useLocale } from '@/locales'
import { useHotkeys, useTiptapStore } from '@/hooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AiCompletion from './components/AiCompletion.vue'
import { useFocus } from '@vueuse/core'
import { useToast } from '@/components/ui/toast/use-toast'
import { Icon } from '@/components/icons'
import Menu from '../ui/menu.vue'
import { DOMSerializer } from 'prosemirror-model'
import { useAIConversation } from '@/hooks/useAIConversation'
import { DEFAULT_SHORTCUTS } from '@/extensions/AI/constants'
import type { Props as TippyProps } from 'tippy.js'

interface Props {
  editor: Editor
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const store = useTiptapStore()
const prompt = ref<string>('')
const cachedPrompt = ref<CachedPrompt | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const { focused } = useFocus(inputRef)
const resultContainer = ref<HTMLDivElement | null>(null)
const { t } = useLocale()
const isShaking = ref<boolean>(false)
const tippyInstance = ref<any>(null)
const menuRef = ref()

const { result, status, handleCompletion, resetConversation, stopGeneration } = useAIConversation(props.editor)

const { toast } = useToast()

interface ShortcutItem {
  label: string
  prompt: string
  icon?: string
  children?: ShortcutItem[]
}

interface MenuItem {
  label: string
  icon?: string
  children?: MenuItem[]
  [key: string]: any // 允许其他属性
}

interface CachedPrompt {
  context: string
  prompt: string
}

const getSelectionText = (editor: Editor) => {
  const slice = editor.state.selection.content()
  const serializer = DOMSerializer.fromSchema(editor.schema)
  const fragment = serializer.serializeFragment(slice.content)
  const div = document.createElement('div')
  div.appendChild(fragment)

  return div.innerHTML
}

const scrollToBottom = async () => {
  await nextTick()
  if (resultContainer.value) {
    resultContainer.value.scrollTop = resultContainer.value.scrollHeight
  }
}

watch(
  () => result.value,
  () => {
    scrollToBottom()
  }
)

async function handleGenerate() {
  if (!props.editor) {
    toast({
      title: t.value('editor.AI.error'),
      description: t.value('editor.AI.editorNotFound'),
      variant: 'destructive',
    })
    return
  }

  try {
    status.value = 'generating'
    const selectionText = getSelectionText(props.editor)

    if (!selectionText.trim()) {
      toast({
        title: t.value('editor.AI.error'),
        description: t.value('editor.AI.noSelection'),
        variant: 'destructive',
      })
      return
    }

    await handleCompletion(selectionText, prompt.value)
    cachedPrompt.value = {
      context: selectionText,
      prompt: prompt.value,
    }
    prompt.value = ''
    await nextTick()
    focused.value = true
  } catch (error) {
    toast({
      title: t.value('editor.AI.error'),
      description: error instanceof Error ? error.message : t.value('editor.AI.unknownError'),
      variant: 'destructive',
    })
    handleClose()
  }
}
const { bind, unbind } = useHotkeys('esc', () => {
  stopGeneration()
  handleClose()
})

const tippyOptions = reactive<Partial<TippyProps>>({
  maxWidth: 600,
  zIndex: 99,
  appendTo: 'parent',
  placement: 'bottom-start',
  onShow(instance) {
    tippyInstance.value = instance
    bind()
    setTimeout(() => {
      focused.value = true
    }, 30)
  },
  onHide() {
    unbind()
    handleClose()
  },
  onDestroy() {
    tippyInstance.value = null
    unbind()
  },
})

const shouldShow: any = computed(() => {
  return store?.state.AIMenu
})

function handleClose() {
  prompt.value = ''
  cachedPrompt.value = null
  resetConversation()
  store!.state.AIMenu = false
}

function handleReGenerate() {
  if (!cachedPrompt.value?.context || !cachedPrompt.value?.prompt) {
    toast({
      title: t.value('editor.AI.error'),
      description: t.value('editor.AI.noCachedPrompt'),
      variant: 'destructive',
    })
    return
  }

  try {
    status.value = 'generating'
    resetConversation()
    handleCompletion(cachedPrompt.value.context, cachedPrompt.value.prompt)
      .then(() => {
        scrollToBottom()
      })
      .catch(error => {
        toast({
          title: t.value('editor.AI.error'),
          description: error instanceof Error ? error.message : t.value('editor.AI.regenerateError'),
          variant: 'destructive',
        })
        handleClose()
      })
  } catch (error) {
    toast({
      title: t.value('editor.AI.error'),
      description: error instanceof Error ? error.message : t.value('editor.AI.unknownError'),
      variant: 'destructive',
    })
    handleClose()
  }
}

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

function shortcutClick(item: MenuItem) {
  if (!props.editor) {
    toast({
      title: t.value('editor.AI.error'),
      description: t.value('editor.AI.editorNotFound'),
      variant: 'destructive',
    })
    return
  }

  try {
    const selectionText = getSelectionText(props.editor)
    const shortcutItem = item as ShortcutItem

    cachedPrompt.value = {
      context: selectionText,
      prompt: shortcutItem.prompt,
    }
    status.value = 'generating'
    handleCompletion(selectionText, shortcutItem.prompt)
      .then(() => {
        scrollToBottom()
        focused.value = true
      })
      .catch(error => {
        toast({
          title: t.value('editor.AI.error'),
          description: error instanceof Error ? error.message : t.value('editor.AI.shortcutError'),
          variant: 'destructive',
        })
        handleClose()
      })
  } catch (error) {
    toast({
      title: t.value('editor.AI.error'),
      description: error instanceof Error ? error.message : t.value('editor.AI.unknownError'),
      variant: 'destructive',
    })
    handleClose()
  }
}

const shortcutMenus = computed<ShortcutItem[]>(() => {
  const shortcuts = props.editor?.extensionManager.extensions.find(e => e.name === 'AI')?.options?.shortcuts
  const mergedShortcuts = [...DEFAULT_SHORTCUTS, ...shortcuts]

  // 对菜单项进行本地化处理
  return mergedShortcuts.map(item => ({
    ...item,
    label: t.value(item.label),
    children: item.children?.map(child => ({
      ...child,
      label: t.value(child.label),
    })),
  }))
})
function handleKey(e) {
  if (status.value === 'init' && shortcutMenus.value.length && !prompt.value) {
    menuRef.value?.handleKeyDown(e)
  }
}
</script>
<template>
  <div
    class="absolute left-0 right-0 top-0 bottom-0"
    :style="{
      zIndex: status === 'init' && prompt === '' ? -1 : 98,
    }"
    v-show="shouldShow"
    @click="handleOverlayClick"
  >
    <BubbleMenu pluginKey="AIMenu" :update-delay="0" v-show="shouldShow" :editor="editor" :tippy-options="tippyOptions">
      <div @keydown="handleKey" class="relative w-[450px] z-[99]" :class="{ 'shake-animation': isShaking }">
        <div
          class="border rounded-sm shadow-sm bg-background"
          v-show="(status === 'generating' || status === 'completed') && result"
        >
          <div ref="resultContainer" class="p-4 line-height-none block overflow-y-auto" style="max-height: 210px">
            <div
              class="text-sm text-foreground EchoContentView"
              :style="{
                padding: 0,
                minHeight: 'auto',
              }"
              v-html="result"
            ></div>
          </div>
        </div>
        <form
          @submit="handleGenerate"
          class="relative w-full items-center flex bg-background mt-3 rounded-md shadow-sm"
        >
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
            class="absolute end-0 inset-y-0 flex items-center justify-center px-2 w-[32px] h-[32px] m-2 rounded-full"
          >
            <Icon name="ArrowUp" class="w-5 h-5 font-bold" />
          </Button>
        </form>
        <div class="mt-3 max-w-56" v-show="status === 'init' && shortcutMenus.length && !prompt">
          <Menu ref="menuRef" :items="shortcutMenus" @item-click="shortcutClick" />
        </div>
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

<style scoped>
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
