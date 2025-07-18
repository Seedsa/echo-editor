<script lang="ts" setup>
import type { ButtonViewReturnComponentProps } from '@/type'
import type { TooltipContentProps } from 'reka-ui'
import { icons } from '@/components/icons'
import { useTiptapStore } from '@/hooks/useStore'
import type { Editor } from '@tiptap/vue-3'
import ActionButton from '@/components/ActionButton.vue'
import { useToast } from '@/components/ui/toast/use-toast'

interface Props {
  editor: Editor
  icon?: keyof typeof icons
  title?: string
  tooltip?: string
  disabled?: boolean
  shortcutKeys?: string[]
  customClass?: string
  loading?: boolean
  tooltipOptions?: TooltipContentProps
  color?: string
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  title: undefined,
  tooltip: undefined,
  disabled: false,
  customClass: '',
  color: undefined,
  loading: false,
  shortcutKeys: undefined,
  tooltipOptions: undefined,
  action: undefined,
  isActive: undefined,
})

const store = useTiptapStore()
const { toast } = useToast()

function handleOpen() {
  const completionsFunc = props.editor.extensionManager.extensions.find(e => e.name === 'AI')?.options?.completions
  if (typeof completionsFunc !== 'function') {
    toast({
      title: 'AI completions method is not set or is not a valid function',
      variant: 'destructive',
    })
    return
  }
  if (completionsFunc.constructor.name !== 'AsyncFunction') {
    toast({
      title: 'AI completions method must be an asynchronous function',
      variant: 'destructive',
    })
    return
  }
  store!.state.AIMenu = true
  props.editor?.commands.focus()
}
</script>

<template>
  <ActionButton :action="handleOpen" title="AI" :disabled="disabled" :icon="icon" :tooltip="tooltip" />
</template>
