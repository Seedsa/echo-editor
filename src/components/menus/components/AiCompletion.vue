<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { Icon } from '@/components/icons'
import MenuItem from '@/components/ui/menu-item.vue'
import { Separator } from '@/components/ui/separator'
import { useLocale } from '@/locales'

const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
  completion: {
    type: String,
    required: true,
  },
})
const { t } = useLocale()
const emits = defineEmits(['generate', 'close'])
function handleReplace() {
  const selection = props.editor.view.state.selection
  props.editor
    .chain()
    .focus()
    .insertContentAt(
      {
        from: selection.from,
        to: selection.to,
      },
      props.completion
    )
    .run()
}
function handleInsert() {
  const { to } = props.editor.view.state.selection
  if (to) {
    props.editor.chain().insertContentAt(to, props.completion).focus().run()
  }
}
function handleGenerate() {
  emits('generate')
}
function handleClose() {
  emits('close')
}
</script>

<template>
  <div class="bg-popover mt-3 text-foreground overflow-auto flex-wrap border rounded-md p-3 max-w-60">
    <div class="flex flex-col gap-1">
      <MenuItem @click="handleReplace">
        <Icon name="Replace" />
        {{ t('editor.AI.replace') }}
      </MenuItem>
      <MenuItem @click="handleInsert">
        <Icon name="TextQuote" />
        {{ t('editor.AI.insert') }}
      </MenuItem>
      <Separator />
      <MenuItem @click="handleGenerate">
        <Icon name="Redo2" />
        {{ t('editor.AI.regenerate') }}
      </MenuItem>
      <MenuItem @click="handleClose">
        <Icon name="Trash2" />
        {{ t('editor.AI.close') }}
      </MenuItem>
    </div>
  </div>
</template>
