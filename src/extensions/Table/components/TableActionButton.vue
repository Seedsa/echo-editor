<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import CreateTablePopover from './CreateTablePopover.vue'
import type { CreateTablePayload } from './CreateTablePopover.vue'
import ActionButton from '@/components/ActionButton.vue'
import type { ButtonViewReturnComponentProps } from '@/type'
import { icons } from '@/components/icons'
interface Props {
  editor: Editor
  icon?: keyof typeof icons
  tooltip?: string
  disabled?: boolean
  color?: string
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  tooltip: undefined,
  disabled: false,
  color: undefined,
  action: undefined,
  isActive: undefined,
})

function createTable(options: CreateTablePayload) {
  if (!props.disabled) {
    props.editor
      .chain()
      .focus()
      .insertTable({ ...options, withHeaderRow: false })
      .run()
  }
}
</script>

<template>
  <CreateTablePopover @create-table="createTable" :disabled="disabled">
    <template #trigger>
      <div style="display: flex">
        <ActionButton
          :icon="icon"
          :tooltip="tooltip"
          :disabled="disabled"
          :color="color"
          :action="action"
          :is-active="isActive"
        >
        </ActionButton>
      </div>
    </template>
  </CreateTablePopover>
</template>
