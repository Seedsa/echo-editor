<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import { Separator } from '@/components/ui/separator'
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

const emits = defineEmits(['discard'])
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
  const selection = props.editor.view.state.selection
  props.editor
    .chain()
    .focus()
    .insertContentAt(selection.to + 1, props.completion)
    .run()
}
</script>

<template>
  <div class="dark:bg-black text-black overflow-auto flex-wrap p-1">
    <Separator />
    <div class="flex flex-row gap-3 mt-3">
      <Button @click="handleReplace" size="sm">
        <Icon name="Replace" />
        替换
      </Button>
      <Button @click="handleInsert" size="sm">
        <Icon name="TextQuote" />
        插入
      </Button>
      <Button @click="emits('discard')" size="sm">
        <Icon name="Trash" />
        丢弃
      </Button>
    </div>
  </div>
</template>
