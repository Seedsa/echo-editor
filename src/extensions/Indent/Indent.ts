import { Extension } from '@tiptap/core'
import type { Editor } from '@tiptap/core'
import ActionButton from '@/components/ActionButton.vue'
import { createIndentCommand, IndentProps } from '@/utils/indent'
import type { GeneralOptions } from '@/type'

export interface IndentOptions extends GeneralOptions<IndentOptions> {
  types: string[]
  minIndent: number
  maxIndent: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      /**
       * Set the indent attribute
       */
      indent: () => ReturnType
      /**
       * Set the outdent attribute
       */
      outdent: () => ReturnType
    }
  }
}

export const Indent = Extension.create<IndentOptions>({
  name: 'indent',
  addOptions() {
    return {
      ...this.parent?.(),
      types: ['paragraph', 'heading', 'blockquote'],
      minIndent: IndentProps.min,
      maxIndent: IndentProps.max,
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return [
          {
            component: ActionButton,
            componentProps: {
              action: () => {
                editor.commands.indent()
              },
              shortcutKeys: ['Tab'],
              icon: 'IndentIncrease',
              tooltip: t('editor.indent.tooltip'),
            },
          },
          {
            component: ActionButton,
            componentProps: {
              action: () => {
                editor.commands.outdent()
              },
              shortcutKeys: ['Shift', 'Tab'],
              icon: 'IndentDecrease',
              tooltip: t('editor.outdent.tooltip'),
            },
          },
        ]
      },
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: element => {
              const identAttr = element.getAttribute('data-indent')
              return (identAttr ? parseInt(identAttr, 10) : 0) || 0
            },
            renderHTML: attributes => {
              if (!attributes.indent) {
                return {}
              }
              return { ['data-indent']: attributes.indent }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      indent: () =>
        createIndentCommand({
          delta: IndentProps.more,
          types: this.options.types,
        }),
      outdent: () =>
        createIndentCommand({
          delta: IndentProps.less,
          types: this.options.types,
        }),
    }
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      'Shift-Tab': () => this.editor.commands.outdent(),
    }
  },
})
