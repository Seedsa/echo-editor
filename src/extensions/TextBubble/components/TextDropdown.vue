<script setup lang="ts">
import { computed } from 'vue'
import { MenuCheckboxItem } from '@/components/ui/menu'
import { Editor } from '@tiptap/vue-3'
import { Icon, icons } from '@/components/icons'
import { useLocale } from '@/locales'
import ActionDropdownButton from '@/components/ActionDropdownButton.vue'
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

const menus = computed<ContentTypeMenu[]>(() => {
  return [
    {
      name: 'paragraph',
      label: t.value('editor.paragraph.tooltip'),
      iconName: 'Paragraph',
      isActive: () =>
        props.editor.isActive('paragraph') &&
        !props.editor.isActive('orderedList') &&
        !props.editor.isActive('bulletList') &&
        !props.editor.isActive('taskList'),
      action: () => props.editor.chain().focus().clearNodes().focus().run(),
    },
    {
      name: 'heading1',
      label: t.value('editor.heading.h1.tooltip'),
      isActive: () => props.editor.isActive('heading', { level: 1 }),
      iconName: 'Heading1',
      action: () => props.editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).focus().run(),
    },
    {
      name: 'heading2',
      label: t.value('editor.heading.h2.tooltip'),
      isActive: () => props.editor.isActive('heading', { level: 2 }),
      iconName: 'Heading2',
      action: () => props.editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).focus().run(),
    },
    {
      name: 'heading3',
      label: t.value('editor.heading.h3.tooltip'),
      isActive: () => props.editor.isActive('heading', { level: 3 }),
      iconName: 'Heading3',
      action: () => props.editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).focus().run(),
    },
    {
      name: 'bulletList',
      label: t.value('editor.bulletlist.tooltip'),
      isActive: () => props.editor.isActive('bulletList'),
      iconName: 'List',
      action: () => props.editor.chain().focus().clearNodes().toggleBulletList().focus().run(),
    },
    {
      name: 'numberedList',
      label: t.value('editor.orderedlist.tooltip'),
      isActive: () => props.editor.isActive('orderedList'),
      iconName: 'ListOrdered',
      action: () => props.editor.chain().focus().clearNodes().toggleOrderedList().focus().run(),
    },
    {
      name: 'taskList',
      label: t.value('editor.tasklist.tooltip'),
      isActive: () => props.editor.isActive('taskList'),
      iconName: 'ListTodo',
      action: () => props.editor.chain().focus().clearNodes().toggleTaskList().focus().run(),
    },
    {
      name: 'blockquote',
      label: t.value('editor.blockquote.tooltip'),
      isActive: () => props.editor.isActive('blockquote'),
      iconName: 'TextQuote',
      action: () => props.editor.chain().focus().clearNodes().toggleBlockquote().focus().run(),
    },
    {
      name: 'codeBlock',
      label: t.value('editor.codeblock.tooltip'),
      isActive: () => props.editor.isActive('codeBlock'),
      iconName: 'Code2',
      action: () => props.editor.chain().focus().clearNodes().toggleCodeBlock().focus().run(),
    },
  ]
})
const activeItem = computed(() => {
  return (
    menus.value.filter(item => item.isActive()).pop() ?? {
      label: t.value('editor.modify'),
    }
  )
})
</script>

<template>
  <ActionDropdownButton :title="activeItem?.label" :sideOffset="5">
    <MenuCheckboxItem
      v-for="(item, index) in menus"
      :key="index"
      @click="item.action"
      class="cursor-pointer"
      :modelValue="item.isActive?.() || false"
    >
      <div class="flex items-center gap-2 px-2">
        <Icon :name="item.iconName" class="h3 w-3" />
        <span> {{ item.label }}</span>
      </div></MenuCheckboxItem
    >
  </ActionDropdownButton>
</template>
