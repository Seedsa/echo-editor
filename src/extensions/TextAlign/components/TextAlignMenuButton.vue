<script lang="ts" setup>
import type { StyleValue } from 'vue'
import { computed, ref, h } from 'vue'
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Toggle } from '@/components/ui/toggle'
import { icons, Icon } from '@/components/icons'
import type { Editor } from '@tiptap/vue-3'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import ActionButton from '@/components/ActionButton.vue'
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
const showPopover = ref(false)

function toggleHeading(key: string, item: any) {
  item.action()
  showPopover.value = false
}

function togglePop() {
  showPopover.value = !showPopover.value
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <div style="display: flex">
        <ActionButton customClass="w-12" enable-tooltip :icon="icon" dropdown :tooltip="tooltip">
          <Icon class="w-3 h-3 ml-1 text-zinc-500" name="MenuDown" />
        </ActionButton>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="min-w-4 w-full flex flex-row gap-1" align="start" side="bottom">
      <Tooltip v-for="(item, index) in props.items" :key="index">
        <TooltipTrigger as-child>
          <DropdownMenuItem class="p-0">
            <Toggle size="sm" @click="item.action" class="w-7 h-7 p-1" :pressed="active.title === item.title">
              <Icon :name="item.icon" v-if="item.icon" />
            </Toggle>
          </DropdownMenuItem>
        </TooltipTrigger>
        <TooltipContent class="flex flex-col items-center">
          <span>{{ item.title }}</span>
          <span>
            {{ item.shortcutKeys?.map(item => getShortcutKey(item)).join(' ') }}
          </span>
        </TooltipContent>
      </Tooltip>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
