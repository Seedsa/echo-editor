import { Extension } from '@tiptap/core'
import type { Editor } from '@tiptap/core'
import { createLineHeightCommand, transformCSStoLineHeight, transformLineHeightToCSS } from '@/utils/line-height'
import LineHeightDropdown from './components/LineHeightDropdown.vue'
import type { GeneralOptions } from '@/type'

export interface LineHeightOptions extends GeneralOptions<LineHeightOptions> {
  types: string[]
  lineHeights: string[]
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
      button({ editor, t }: { editor: Editor; t: any }) {
        return {
          component: LineHeightDropdown,
          componentProps: {
            editor,
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
              return transformCSStoLineHeight(element.style.lineHeight) || null
            },
            renderHTML: attributes => {
              if (!attributes.lineHeight) {
                return {}
              }
              const cssLineHeight = transformLineHeightToCSS(attributes.lineHeight)
              return {
                style: `line-height: ${cssLineHeight};`,
              }
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
