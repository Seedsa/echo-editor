<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ActionButton from '@/components/ActionButton.vue'
import LinkEditBlock from './LinkEditBlock.vue'
import { ButtonViewReturnComponentProps } from '@/type'

interface Props {
  editor: Editor
  icon?: any
  title?: string
  tooltip?: string
  disabled?: boolean
  shortcutKeys?: string[]
  isActive?: ButtonViewReturnComponentProps['isActive']
  action?: ButtonViewReturnComponentProps['action']
}
const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  title: undefined,
  tooltip: undefined,
  disabled: false,
  shortcutKeys: undefined,
  action: undefined,
  isActive: undefined,
})

function onSetLink(link: string, text?: string, openInNewTab?: boolean) {
  if (props.action) {
    props.action({ link, text, openInNewTab })
  }
}
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <ActionButton :icon="icon" :tooltip="tooltip" :is-active="isActive" :disabled="disabled" />
    </PopoverTrigger>
    <PopoverContent hide-when-detached as-child class="w-full" align="start" side="bottom">
      <LinkEditBlock :editor="editor" @onSetLink="onSetLink" />
    </PopoverContent>
  </Popover>
</template>
