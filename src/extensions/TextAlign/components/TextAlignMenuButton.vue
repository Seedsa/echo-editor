<script lang="ts" setup>
import type { StyleValue } from 'vue'
import { computed } from 'vue'
import { MenuItem } from '@/components/ui/menu'
import { Toggle } from '@/components/ui/toggle'
import { icons, Icon } from '@/components/icons'
import type { Editor } from '@tiptap/vue-3'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import ActionDropdownButton from '@/components/ActionDropdownButton.vue'
import type { ButtonViewReturnComponentProps } from '@/type'
import { getShortcutKey } from '@/utils/plateform'

export interface Item {
  title: string
  icon?: keyof typeof icons
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: StyleValue
  shortcutKeys?: string[]
  disabled?: boolean
  divider?: boolean
  default?: boolean
}
interface Props {
  editor: Editor
  disabled?: boolean
  color?: string
  maxHeight?: string | number
  icon?: any
  tooltip?: string
  items?: Item[]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  color: undefined,
  maxHeight: undefined,
  icon: undefined,
  tooltip: '',
  items: () => [],
})

const active = computed(() => {
  const find: any = props.items.find((k: any) => k.isActive())
  if (find && !find.default) {
    return {
      ...find,
      icon: find.icon ? find.icon : props.icon,
    }
  }
  const item: Item = {
    title: props.tooltip,
    icon: props.icon,
    isActive: () => false,
  }

  return item
})
</script>

<template>
  <ActionDropdownButton :icon="icon" :tooltip="tooltip" :disabled="disabled" class="min-w-4 w-full flex flex-row gap-1">
    <TooltipProvider>
      <Tooltip v-for="(item, index) in props.items" :key="index">
        <TooltipTrigger as-child>
          <MenuItem class="p-0" @click="item.action">
            <Toggle size="sm" class="w-7 h-7 p-1" :pressed="active.title === item.title">
              <Icon :name="item.icon" v-if="item.icon" />
            </Toggle>
          </MenuItem>
        </TooltipTrigger>
        <TooltipContent class="flex flex-col items-center">
          <span>{{ item.title }}</span>
          <span>
            {{ item.shortcutKeys?.map(item => getShortcutKey(item)).join(' ') }}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </ActionDropdownButton>
</template>
