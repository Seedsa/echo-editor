import { Extension } from '@tiptap/core'
import type { Editor } from '@tiptap/core'
import { createLineHeightCommand } from '@/utils/line-height'
import LineHeightDropdown from './components/LineHeightDropdown.vue'
import type { GeneralOptions } from '@/type'
import { DEFAULT_LINE_HEIGHT } from '@/constants'

export interface LineHeightOptions extends GeneralOptions<LineHeightOptions> {
  types: string[]
  lineHeights: string[]
  defaultHeight: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType
      unsetLineHeight: () => ReturnType
    }
  }
}

export const LineHeight = Extension.create<LineHeightOptions>({
  name: 'lineHeight',
  addOptions() {
    return {
      ...this.parent?.(),
      types: ['paragraph', 'heading', 'list_item', 'todo_item'],
      lineHeights: ['100%', '115%', '150%', '200%', '250%', '300%'],
      defaultHeight: DEFAULT_LINE_HEIGHT,
      button({ editor, t }: { editor: Editor; t: any }) {
        return {
          component: LineHeightDropdown,
          componentProps: {
            editor,
            disabled: !editor.isEditable || !editor.can().setLineHeight('100%'),
            icon: 'LineHeight',
            tooltip: t('editor.lineheight.tooltip'),
          },
        }
      },
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => {
              return element.style.lineHeight || this.options.defaultHeight
            },
            renderHTML: attributes => {
              if (attributes.lineHeight === this.options.defaultHeight || !attributes.lineHeight) {
                return {}
              }
              return { style: `line-height: ${attributes.lineHeight}` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight: lineHeight => createLineHeightCommand(lineHeight),
      unsetLineHeight:
        () =>
          ({ commands }) => {
            return this.options.types.every(type => commands.resetAttributes(type, 'lineHeight'))
          },
    }
  },
})
