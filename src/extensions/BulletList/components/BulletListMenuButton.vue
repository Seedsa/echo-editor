<script lang="ts" setup>
import { computed } from 'vue'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { useLocale } from '@/locales'
import type { Editor } from '@tiptap/vue-3'
import ActionDropdownButtonSplit from '@/components/ActionDropdownButtonSplit.vue'
import { MenuItem } from '@/components/ui/menu'

interface BulletListOption {
  label: string
  value: 'disc' | 'circle' | 'square'
}

interface Props {
  editor: Editor
  disabled?: boolean
  tooltip?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  tooltip: '',
})

const { t } = useLocale()

const BulletListOptions: BulletListOption[] = [
  { label: 'editor.bulletlist.disc.tooltip', value: 'disc' },
  { label: 'editor.bulletlist.circle.tooltip', value: 'circle' },
  { label: 'editor.bulletlist.square.tooltip', value: 'square' },
]

const active = computed((): 'disc' | 'circle' | 'square' => {
  if (props.editor?.isActive('bulletList')) {
    return props.editor.getAttributes('bulletList').listStyleType as 'disc' | 'circle' | 'square'
  }
  return 'disc' // 默认值
})

function toggleBulletList(item: BulletListOption): void {
  if (props.editor.isActive('bulletList')) {
    if (props.editor.getAttributes('bulletList').listStyleType === item.value) {
      props.editor.chain().focus().toggleBulletList().run()
    } else {
      props.editor.chain().focus().updateAttributes('bulletList', { listStyleType: item.value }).run()
    }
  } else {
    props.editor.chain().focus().toggleBulletList().updateAttributes('bulletList', { listStyleType: item.value }).run()
  }
}
</script>

<template>
  <ActionDropdownButtonSplit
    :action="toggleBulletList"
    :disabled="disabled"
    :tooltip="tooltip"
    class="min-w-4 w-full grid grid-cols-3 gap-1"
  >
    <TooltipProvider>
      <Tooltip :delay-duration="0" v-for="item in BulletListOptions" :key="item.value">
        <TooltipTrigger>
          <MenuItem class="p-0" @click="toggleBulletList(item)">
            <div
              :class="[active === item.value ? 'bg-accent border border-accent-foreground' : '']"
              class="h-[48px] flex flex-col w-[48px] box-border rounded-sm border"
            >
              <ol
                :style="{ listStyleType: item.value, lineHeight: 1 }"
                class="text-[10px] pl-3 flex-1 list-outside flex flex-col items-center justify-center"
              >
                <li v-for="i in 3" :key="i">
                  <hr class="border-0 bg-gray-200 h-[3px] w-6 my-1" />
                </li>
              </ol>
            </div>
          </MenuItem>
        </TooltipTrigger>
        <TooltipContent side="bottom">{{ t(item.label) }}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </ActionDropdownButtonSplit>
</template>
