import { Group } from './types'
import { useLocale } from '@/locales'
const { t } = useLocale()

export const GROUPS: Group[] = [
  {
    name: 'format',
    title: '格式',
    commands: [
      {
        name: 'heading1',
        label: t.value('editor.heading.h1.tooltip'),
        aliases: ['h1', 'bt', 'bt1'],
        description: 'okok',
        iconName: 'Heading1',
        action: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
        },
      },
      {
        name: 'heading2',
        label: t.value('editor.heading.h2.tooltip'),
        aliases: ['h2', 'bt', 'bt2'],
        iconName: 'Heading2',
        action: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
        },
      },
      {
        name: 'heading3',
        label: t.value('editor.heading.h3.tooltip'),
        aliases: ['h3', 'bt', 'bt3'],
        iconName: 'Heading3',
        action: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
        },
      },
      {
        name: 'bulletList',
        label: t.value('editor.bulletlist.tooltip'),
        aliases: ['ul', 'yxlb'],
        iconName: 'List',
        action: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
      },
      {
        name: 'numberedList',
        label: t.value('editor.orderedlist.tooltip'),
        aliases: ['ol', 'yxlb'],
        iconName: 'ListOrdered',
        action: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
      },
      {
        name: 'taskList',
        label: t.value('editor.tasklist.tooltip'),
        iconName: 'ListTodo',
        description: 'Task list with todo items',
        aliases: ['todo'],
        action: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run()
        },
      },
      {
        name: 'blockquote',
        label: t.value('editor.blockquote.tooltip'),
        description: '插入引入格式',
        aliases: ['yr'],
        iconName: 'TextQuote',
        action: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setBlockquote().run()
        },
      },
      {
        name: 'codeBlock',
        label: t.value('editor.codeblock.tooltip'),
        iconName: 'Code2',
        description: 'Code block with syntax highlighting',
        shouldBeHidden: editor => editor.isActive('columns'),
        action: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setCodeBlock().run()
        },
      },
    ],
  },
  {
    name: 'insert',
    title: '插入',
    commands: [
      {
        name: 'table',
        label: t.value('editor.table.tooltip'),
        iconName: 'Table',
        description: 'Insert a table',
        aliases: ['table', 'bg', 'biaoge', 'biao'],
        shouldBeHidden: editor => editor.isActive('columns'),
        action: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()
        },
      },
      {
        name: 'horizontalRule',
        label: t.value('editor.horizontalrule.tooltip'),
        iconName: 'Minus',
        description: 'Insert a horizontal divider',
        aliases: ['hr', 'fgx', 'fg'],
        action: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run()
        },
      },
      {
        name: '2columns',
        label: '两栏',
        iconName: 'Columns2',
        description: 'Add two column content',
        aliases: ['2', 'cols', '2cols'],
        shouldBeHidden: editor => editor.isActive('columns'),
        action: ({ editor, range }) => {
          editor
            .chain()
            .deleteRange(range)
            .setColumns(2)
            .focus(editor.state.selection.head - 1)
            .run()
        },
      },
      {
        name: '3columns',
        label: '三栏',
        iconName: 'Columns3',
        description: 'Add three column content',
        aliases: ['3', 'cols', '3cols'],
        shouldBeHidden: editor => editor.isActive('columns'),
        action: ({ editor, range }) => {
          editor
            .chain()
            .deleteRange(range)
            .setColumns(3)
            .focus(editor.state.selection.head - 1)
            .run()
        },
      },
      {
        name: '4columns',
        label: '四栏',
        iconName: 'Columns4',
        description: 'Add forth column content',
        aliases: ['4', 'cols', '4cols'],
        shouldBeHidden: editor => editor.isActive('columns'),
        action: ({ editor, range }) => {
          editor
            .chain()
            .deleteRange(range)
            .setColumns(4)
            .focus(editor.state.selection.head - 1)
            .run()
        },
      },
    ],
  },
  {
    name: 'others',
    title: '嵌入第三方服务',
    commands: [
      {
        name: 'youku',
        label: '优酷',
        iconUrl: 'https://gw.alipayobjects.com/zos/bmw-prod/4825b4b8-96a3-463f-8e6a-c28ae8b792b0.svg',
        aliases: ['youku', 'yk'],
        shouldBeHidden: editor => editor.isActive('columns'),
        action: ({ editor, range }) => {
          editor
            .chain()
            .deleteRange(range)
            .focus()
            .setIframe({
              src: '',
              service: 'youku',
            })
            .run()
        },
      },
      {
        name: 'bilibili',
        label: '哔哩哔哩',
        iconUrl: 'https://gw.alipayobjects.com/zos/bmw-prod/93d6bda1-2ab6-4b20-97e5-c0a73f2a42cd.svg',
        aliases: ['bilibili', 'bili', 'bl'],
        shouldBeHidden: editor => editor.isActive('columns'),
        action: ({ editor, range }) => {
          editor
            .chain()
            .deleteRange(range)
            .focus()
            .setIframe({
              src: '',
              service: 'bilibili',
            })
            .run()
        },
      },
      {
        name: 'amap',
        label: '高德地图',
        iconUrl: 'https://gw.alipayobjects.com/zos/bmw-prod/93d6bda1-2ab6-4b20-97e5-c0a73f2a42cd.svg',
        aliases: ['gaode', 'amap', 'map'],
        shouldBeHidden: editor => editor.isActive('columns'),
        action: ({ editor, range }) => {
          editor
            .chain()
            .deleteRange(range)
            .focus()
            .setIframe({
              src: '',
              service: 'amap',
            })
            .run()
        },
      },
      {
        name: 'modao',
        label: '墨刀',
        iconUrl: 'https://gw.alipayobjects.com/zos/bmw-prod/93d6bda1-2ab6-4b20-97e5-c0a73f2a42cd.svg',
        aliases: ['md', 'amap', 'map'],
        shouldBeHidden: editor => editor.isActive('columns'),
        action: ({ editor, range }) => {
          editor
            .chain()
            .deleteRange(range)
            .focus()
            .setIframe({
              src: '',
              service: 'modao',
            })
            .run()
        },
      },
    ],
  },
]
