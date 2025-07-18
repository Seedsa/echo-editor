<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import TableGrid from '@/components/TableGrid.vue'
export interface GridSize {
  rows: number
  cols: number
}

export interface CreateTablePayload extends GridSize {
  withHeaderRow: boolean
}

interface Emits {
  (event: 'create-table', payload: CreateTablePayload): void
}

defineProps({
  disabled: {
    default: false,
  },
})
const emit = defineEmits<Emits>()
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <button :disabled="disabled" class="m-0 p-0">
        <slot name="trigger" />
      </button>
    </PopoverTrigger>
    <PopoverContent class="w-full" align="start" side="bottom">
      <TableGrid @create-table="e => emit('create-table', e)" />
    </PopoverContent>
  </Popover>
</template>
