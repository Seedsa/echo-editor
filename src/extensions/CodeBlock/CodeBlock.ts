import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { textblockTypeInputRule } from '@tiptap/core'
import type { GeneralOptions } from '@/type'

import NodeView from './components/NodeView.vue'

export interface CodeBlockOptions extends GeneralOptions<CodeBlockOptions> { }

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setCodeBlock: {
      setCodeBlock: (options?: any) => ReturnType
    }
  }
}



/**
 * Matches a code block with backticks.
 */
export const backtickInputRegex = /^```([a-z]+)?[\s\n]$/

/**
 * Matches a code block with tildes.
 */
export const tildeInputRegex = /^~~~([a-z]+)?[\s\n]$/


export const CodeBlock = Node.create({
  name: 'codeBlock',
  group: 'block',
  atom: true,
  content: 'text*',
  addAttributes() {
    return {
      vnode: {
        default: true,
      },
      code: {
        default: '',
        parseHTML: (element) => {
          return element.textContent || ''
        }
      },
      language: {
        default: 'plaintext',
      },
      theme: {
        default: 'github-light',
      },
      lineNumbers: {
        default: true,
      },
      wordWrap: {
        default: false,
      },
      tabSize: {
        default: 2
      },
      shouldFocus: {
        default: true,
        parseHTML: () => false,
        renderHTML: false
      }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
        getAttrs: (node: HTMLElement) => {
          return {
            code: node.textContent || ''
          }
        }
      },
      {
        tag: 'pre code',
        preserveWhitespace: 'full',
        getAttrs: (node: HTMLElement) => {
          return {
            code: node.textContent || ''
          }
        }
      }
    ]
  },
  renderHTML({ HTMLAttributes, node }) {
    let code = node.attrs.code || node.content.firstChild?.text || ''
    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['code', {}, code]
    ]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      setCodeBlock:
        (options) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: {
                ...options,
                shouldFocus: true
              },
            })
          },
    }
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.setCodeBlock({}),
    }
  },
  addInputRules() {
    return [
      textblockTypeInputRule({
        find: backtickInputRegex,
        type: this.type,
        getAttributes: match => ({
          language: match[1],
        }),
      }),
      textblockTypeInputRule({
        find: tildeInputRegex,
        type: this.type,
        getAttributes: match => ({
          language: match[1],
        }),
      }),
    ]
  },
})
