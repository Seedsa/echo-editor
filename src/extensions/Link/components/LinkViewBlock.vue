<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { useLocale } from '@/locales'
import { truncate } from '@/utils/utils'
import ActionButton from '@/components/ActionButton.vue'
import { Separator } from '@/components/ui/separator'

interface Props {
  editor: Editor
  link?: string
}
withDefaults(defineProps<Props>(), {
  link: undefined,
})
const { t } = useLocale()
const emits = defineEmits(['clear', 'edit'])

function onClear() {
  emits('clear')
}
function onEdit() {
  emits('edit')
}
</script>

<template>
  <div
    class="flex items-center gap-2 p-2 bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800"
  >
    <a :href="link" target="_blank" rel="noopener noreferrer" class="text-sm underline break-all">
      {{
        truncate(link, {
          length: 50,
          omission: '…',
        })
      }}
    </a>
    <Separator orientation="vertical" class="h-4" v-if="link" />
    <div class="flex flex-nowrap">
      <ActionButton
        icon="Pencil"
        :tooltip="t('editor.link.edit.tooltip')"
        :action="onEdit"
        :tooltip-options="{ sideOffset: 15 }"
      />
      <ActionButton
        icon="Unlink"
        :tooltip="t('editor.link.unlink.tooltip')"
        :action="onClear"
        :tooltip-options="{ sideOffset: 15 }"
      />
    </div>
  </div>
</template>
