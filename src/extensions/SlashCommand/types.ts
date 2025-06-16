import type { Editor, Range } from '@tiptap/core'
import { icons } from '@/components/icons/IconMap'
export interface Group {
  name: string
  title: string
  commands: Command[]
}

export interface Command {
  name: string
  label: string
  description?: string
  aliases?: string[]
  iconName?: keyof typeof icons
  iconUrl?: string
  action: ({ editor, range }: { editor: Editor; range: Range }) => void
  shouldBeHidden?: (editor: Editor) => boolean
}

export interface MenuListProps {
  editor: Editor
  items: Group[]
  command: (command: Command) => void
}
