import { Editor } from '@tiptap/core'
import { Group } from './types'
import { useLocale } from '@/locales'
import { hasExtension } from '@/utils/utils'
import { AllEmbedServices } from '@/extensions/Iframe/embed'

export function renderGroups(editor: Editor) {
  const { t } = useLocale()
  const groups: Group[] = [
    {
      name: 'format',
      title: t.value('editor.slash.format'),
      commands: [
        {
          name: 'paragraph',
          label: t.value('editor.paragraph.tooltip'),
          aliases: ['paragraph', 'zw'],
          iconName: 'Paragraph',
          shouldBeHidden: editor => !hasExtension(editor, 'heading'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setParagraph().run()
          },
        },
        {
          name: 'heading1',
          label: t.value('editor.heading.h1.tooltip'),
          aliases: ['h1', 'bt', 'bt1'],
          iconName: 'Heading1',
          shouldBeHidden: editor => !hasExtension(editor, 'heading'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
          },
        },
        {
          name: 'heading2',
          label: t.value('editor.heading.h2.tooltip'),
          aliases: ['h2', 'bt', 'bt2'],
          iconName: 'Heading2',
          shouldBeHidden: editor => !hasExtension(editor, 'heading'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
          },
        },
        {
          name: 'heading3',
          label: t.value('editor.heading.h3.tooltip'),
          aliases: ['h3', 'bt', 'bt3', 'heading3'],
          iconName: 'Heading3',
          shouldBeHidden: editor => !hasExtension(editor, 'heading'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
          },
        },
        {
          name: 'bulletList',
          label: t.value('editor.bulletlist.tooltip'),
          aliases: ['ul', 'yxlb', 'bulletList'],
          iconName: 'List',
          shouldBeHidden: editor => !hasExtension(editor, 'bulletList'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run()
          },
        },
        {
          name: 'numberedList',
          label: t.value('editor.orderedlist.tooltip'),
          aliases: ['ol', 'yxlb'],
          iconName: 'ListOrdered',
          shouldBeHidden: editor => !hasExtension(editor, 'orderedList'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run()
          },
        },
        {
          name: 'codeBlock',
          label: t.value('editor.codeblock.tooltip'),
          iconName: 'Code2',
          aliases: ['codeBlock'],
          description: 'Code block with syntax highlighting',
          shouldBeHidden: editor => !hasExtension(editor, 'codeBlock') || editor.isActive('columns'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setCodeBlock().run()
          },
        },
        {
          name: 'blockquote',
          label: t.value('editor.blockquote.tooltip'),
          description: '插入引入格式',
          aliases: ['yr'],
          iconName: 'TextQuote',
          shouldBeHidden: editor => !hasExtension(editor, 'blockquote'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setBlockquote().run()
          },
        },
        {
          name: 'horizontalrule',
          label: t.value('editor.horizontalrule.tooltip'),
          aliases: ['fgx', 'horizontalRule'],
          iconName: 'Minus',
          shouldBeHidden: editor => !hasExtension(editor, 'horizontalRule'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run()
          },
        },
        {
          name: 'link',
          label: t.value('editor.link.tooltip'),
          aliases: ['link', 'lianjie', 'lj'],
          iconName: 'Link',
          shouldBeHidden: editor => !hasExtension(editor, 'link'),
          action: ({ editor, range }) => {
            editor
              .chain()
              .deleteRange(range)
              .extendMarkRange('link')
              .insertContent({
                type: 'text',
                text: 'link',
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: '',
                      target: '_blank',
                    },
                  },
                ],
              })
              .setLink({ href: '' })
              .focus()
              .run()
          },
        },
      ],
    },
    {
      name: 'insert',
      title: t.value('editor.slash.insert'),
      commands: [
        {
          name: 'image',
          label: t.value('editor.image.tooltip'),
          iconName: 'ImageUp',
          description: 'Insert a image',
          aliases: ['image', 'tp', 'tupian'],
          shouldBeHidden: editor => !hasExtension(editor, 'image') || editor.isActive('columns'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setImageUpload().run()
          },
        },
        {
          name: 'table',
          label: t.value('editor.table.tooltip'),
          iconName: 'Table',
          description: 'Insert a table',
          aliases: ['table', 'bg', 'biaoge', 'biao'],
          shouldBeHidden: editor => !hasExtension(editor, 'table') || editor.isActive('columns'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()
          },
        },
        {
          name: 'video',
          label: t.value('editor.video.tooltip'),
          iconName: 'Video',
          description: 'Insert a video',
          aliases: ['video', 'sp', 'shipin'],
          shouldBeHidden: editor => !hasExtension(editor, 'video') || editor.isActive('columns'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setVideoUpload().run()
          },
        },
        {
          name: 'taskList',
          label: t.value('editor.tasklist.tooltip'),
          iconName: 'ListTodo',
          description: 'Task list with todo items',
          aliases: ['todo'],
          shouldBeHidden: editor => !hasExtension(editor, 'taskList'),
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run()
          },
        },
        {
          name: 'columns',
          label: t.value('editor.columns.tooltip'),
          iconName: 'Columns2',
          description: 'Add two column content',
          aliases: ['columns', 'cols', '2cols'],
          shouldBeHidden: editor => !hasExtension(editor, 'columns') || editor.isActive('columns'),
          action: ({ editor, range }) => {
            editor
              .chain()
              .deleteRange(range)
              .setColumns()
              .focus(editor.state.selection.head - 1)
              .run()
          },
        },
        {
          name: 'three-columns',
          label: t.value('editor.threeColumns.tooltip'),
          iconName: 'Columns3',
          description: 'Add three column content',
          aliases: ['columns', 'cols', '3cols'],
          shouldBeHidden: editor => !hasExtension(editor, 'columns') || editor.isActive('columns'),
          action: ({ editor, range }) => {
            editor
              .chain()
              .deleteRange(range)
              .setThreeColumns()
              .focus(editor.state.selection.head - 1)
              .run()
          },
        },
        {
          name: 'four-columns',
          label: t.value('editor.fourColumns.tooltip'),
          iconName: 'Columns4',
          description: 'Add four column content',
          aliases: ['columns', 'cols', '4cols'],
          shouldBeHidden: editor => !hasExtension(editor, 'columns') || editor.isActive('columns'),
          action: ({ editor, range }) => {
            editor
              .chain()
              .deleteRange(range)
              .setFourColumns()
              .focus(editor.state.selection.head - 1)
              .run()
          },
        },
      ],
    },
  ]
  const hasIframes = hasExtension(editor, 'iframes')
  if (hasIframes) {
    const services = AllEmbedServices
    groups.push({
      name: 'others',
      title: t.value('editor.slash.embed'),
      commands: services.map(item => ({
        name: item.value,
        label: item.label,
        iconName: item.icon,
        aliases: [item.value, item.label],
        shouldBeHidden: editor => editor.isActive('columns'),
        action: ({ editor, range }) => {
          editor
            .chain()
            .deleteRange(range)
            .focus()
            .setIframe({
              src: '',
              service: item.value,
            })
            .run()
        },
      })),
    })
  }
  return groups
}
