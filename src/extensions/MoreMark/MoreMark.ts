import { Extension } from '@tiptap/core'
import type { Extensions } from '@tiptap/core'
import type { SubscriptExtensionOptions as TiptapSubscriptOptions } from '@tiptap/extension-subscript'
import { Subscript as TiptapSubscript } from '@tiptap/extension-subscript'
import type { SuperscriptExtensionOptions as TiptapSuperscriptOptions } from '@tiptap/extension-superscript'
import { Superscript as TiptapSuperscript } from '@tiptap/extension-superscript'
import type { CodeOptions as TiptapCodeOptions } from '@tiptap/extension-code'
import { Code as TiptapCode } from '@tiptap/extension-code'
import type { Item } from './components/ActionMoreButton.vue'
import ActionMoreButton from './components/ActionMoreButton.vue'
import type { GeneralOptions } from '@/type'

export interface MoreMarkOptions extends GeneralOptions<MoreMarkOptions> {
  /**
   * // 下标
   *
   * @default true
   */
  subscript: Partial<TiptapSubscriptOptions> | false
  /**
   * // 上标
   *
   * @default true
   */
  superscript: Partial<TiptapSuperscriptOptions> | false
  /**
   * // 代码
   *
   * @default true
   */
  code: Partial<TiptapCodeOptions> | false
}

export const MoreMark = Extension.create<MoreMarkOptions>({
  name: 'moreMark',
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, extension, t }) {
        const subscript = extension.options.subscript
        const superscript = extension.options.superscript
        const code = extension.options.code
        const subBtn: Item = {
          action: () => editor.commands.toggleSubscript(),
          isActive: () => editor.isActive('subscript') || false,
          disabled: !editor.can().toggleSubscript(),
          icon: 'Subscript',
          title: t('editor.subscript.tooltip'),
          shortcutKeys: ['mod', '.'],
        }

        const superBtn: Item = {
          action: () => editor.commands.toggleSuperscript(),
          isActive: () => editor.isActive('superscript') || false,
          disabled: !editor.can().toggleSuperscript(),
          icon: 'Superscript',
          title: t('editor.superscript.tooltip'),
          shortcutKeys: ['mod', ','],
        }
        const codeBtn: Item = {
          action: () => editor.commands.toggleCode(),
          isActive: () => editor.isActive('code') || false,
          disabled: !editor.can().toggleCode(),
          icon: 'Code',
          title: t('editor.code.tooltip'),
          shortcutKeys: ['mod', 'E'],
        }
        const items: Item[] = []

        if (subscript !== false) items.push(subBtn)
        if (superscript !== false) items.push(superBtn)
        if (code !== false) items.push(codeBtn)

        return {
          component: ActionMoreButton,
          componentProps: {
            icon: 'Type',
            tooltip: t('editor.moremark'),
            disabled: false,
            items,
          },
        }
      },
    }
  },

  addExtensions() {
    const extensions: Extensions = []

    if (this.options.subscript !== false) {
      extensions.push(TiptapSubscript.configure(this.options.subscript))
    }

    if (this.options.superscript !== false) {
      extensions.push(TiptapSuperscript.configure(this.options.superscript))
    }
    if (this.options.code !== false) {
      extensions.push(TiptapCode.configure(this.options.code))
    }

    return extensions
  },
})
