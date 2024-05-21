<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Editor } from '@tiptap/vue-3'
import { Icon, icons } from '@/components/icons'
import { useLocale } from '@/locales'
interface ContentTypeMenu {
  name: string
  label: string
  iconName: keyof typeof icons
  action?: (value?: unknown) => void
  isActive: () => boolean
}
interface Props {
  editor: Editor
  disabled?: boolean
  color?: string
  maxHeight?: string | number
  icon?: any
  tooltip?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  color: undefined,
  maxHeight: undefined,
  icon: undefined,
  tooltip: '',
  items: () => [],
})
const { t } = useLocale()
const menus: ContentTypeMenu[] = [
  {
    name: 'paragraph',
    label: t.value('editor.paragraph.tooltip'),
    iconName: 'Heading1',
    isActive: () =>
      props.editor.isActive('paragraph') &&
      !props.editor.isActive('orderedList') &&
      !props.editor.isActive('bulletList') &&
      !props.editor.isActive('taskList'),
    action: () => props.editor.chain().focus().clearNodes().run(),
  },
  {
    name: 'heading1',
    label: t.value('editor.heading.h1.tooltip'),
    isActive: () => props.editor.isActive('heading', { level: 1 }),
    iconName: 'Heading1',
    action: () => props.editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
  },
  {
    name: 'heading2',
    label: t.value('editor.heading.h2.tooltip'),
    isActive: () => props.editor.isActive('heading', { level: 2 }),
    iconName: 'Heading2',
    action: () => props.editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
  },
  {
    name: 'heading3',
    label: t.value('editor.heading.h3.tooltip'),
    isActive: () => props.editor.isActive('heading', { level: 3 }),
    iconName: 'Heading3',
    action: () => props.editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
  },
  {
    name: 'bulletList',
    label: t.value('editor.bulletlist.tooltip'),
    isActive: () => props.editor.isActive('bulletList'),
    iconName: 'List',
    action: () => props.editor.chain().focus().clearNodes().toggleBulletList().run(),
  },
  {
    name: 'numberedList',
    label: t.value('editor.orderedlist.tooltip'),
    isActive: () => props.editor.isActive('orderedList'),
    iconName: 'ListOrdered',
    action: () => props.editor.chain().focus().clearNodes().toggleOrderedList().run(),
  },
  {
    name: 'taskList',
    label: t.value('editor.tasklist.tooltip'),
    isActive: () => props.editor.isActive('taskList'),
    iconName: 'ListTodo',
    action: () => props.editor.chain().focus().clearNodes().toggleTaskList().run(),
  },
  {
    name: 'blockquote',
    label: t.value('editor.blockquote.tooltip'),
    isActive: () => props.editor.isActive('blockquote'),
    iconName: 'TextQuote',
    action: () => props.editor.chain().focus().clearNodes().toggleBlockquote().run(),
  },
  {
    name: 'codeBlock',
    label: t.value('editor.codeblock.tooltip'),
    isActive: () => props.editor.isActive('codeBlock'),
    iconName: 'Code2',
    action: () => props.editor.chain().focus().clearNodes().toggleCodeBlock().run(),
  },
]
const activeItem = computed(() => {
  return (
    menus.filter(item => item.isActive()).pop() ?? {
      label: '修改',
    }
  )
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-[32px] flex gap-1 px-1.5">
        <span class="whitespace-nowrap text-sm font-normal"> {{ activeItem?.label }}</span>
        <Icon name="ChevronDown" class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent hideWhenDetached class="w-full p-1" align="start" :sideOffset="5">
      <DropdownMenuCheckboxItem
        v-for="(item, index) in menus"
        :key="index"
        @click="item.action"
        class="cursor-pointer"
        :checked="item.isActive?.() || false"
      >
        <div class="flex items-center gap-2 px-2">
          <Icon :name="item.iconName" class="h3 w-3" />
          <span> {{ item.label }}</span>
        </div></DropdownMenuCheckboxItem
      >
    </DropdownMenuContent>
  </DropdownMenu>
</template>
