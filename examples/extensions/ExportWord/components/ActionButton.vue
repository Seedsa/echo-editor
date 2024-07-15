<script setup lang="ts">
import { ActionButton } from 'echo-editor'
import type { Editor } from 'echo-editor'
import { ButtonViewReturnComponentProps } from 'echo-editor'
import iconUrl from '../../../icons/exportWord.svg'

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  isActive: undefined,
})

interface Props {
  disabled?: boolean
  isActive?: ButtonViewReturnComponentProps['isActive']
  editor?: Editor
}

function handleExport() {
  props.editor?.commands.exportToWord()
}
</script>

<template>
  <action-button tooltip="ExportToWord" :is-active="isActive" :disabled="disabled" :action="handleExport">
    <template #icon>
      <iconUrl style="width: 16px; height: 16px" />
    </template>
  </action-button>
</template>
