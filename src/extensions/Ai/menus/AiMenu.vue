<script setup lang="ts">
import { computed, reactive, unref } from 'vue'
import type { NodeSelection } from '@tiptap/pm/state'
import { TextSelection } from '@tiptap/pm/state'
import { Separator } from '@/components/ui/separator'
import type { Editor, Extension } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3'
import type { BaseKitOptions } from '@/extensions/BaseKit'
import { useLocale } from '@/locales'
import { CellSelection } from '@tiptap/pm/tables'

interface Props {
  editor: Editor
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const { t } = useLocale()
const tippyOptions = reactive<Record<string, unknown>>({
  maxWidth: 'auto',
  zIndex: 20,
  appendTo: 'parent',
  moveTransition: 'transform 0.15s ease-out',
})
</script>
<template>
  <BubbleMenu :editor="editor" :tippy-options="tippyOptions">
    <div class="echo-editor-editor__menu-bubble">
      <div class="echo-editor-editor__menu-bubble__content bg-background">
        <div class="echo-editor-editor__menu-bubble__container">12321</div>
      </div>
    </div>
  </BubbleMenu>
</template>
