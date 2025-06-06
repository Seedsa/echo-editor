import { mergeAttributes } from '@tiptap/core'
import type { HorizontalRuleOptions as TiptapHorizontalRuleOptions } from '@tiptap/extension-horizontal-rule'
import { HorizontalRule as TiptapHorizontalRule } from '@tiptap/extension-horizontal-rule'

import ActionButton from '@/components/ActionButton.vue'

import type { GeneralOptions } from '@/type'

export interface HorizontalRuleOptions extends TiptapHorizontalRuleOptions, GeneralOptions<HorizontalRuleOptions> { }

export const HorizontalRule = TiptapHorizontalRule.extend<HorizontalRuleOptions>({
  renderHTML() {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': this.name,
      }),
      ['hr'],
    ]
  },
  addOptions() {
    return {
      ...this.parent!(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor?.chain().focus().setHorizontalRule().run(),
          disabled: !editor?.isEditable || !editor.can().setHorizontalRule(),
          icon: 'Minus',
          shortcutKeys: ['mod', 'alt', 'S'],
          tooltip: t('editor.horizontalrule.tooltip'),
        },
      }),
    }
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-s': () => this.editor.chain().setHorizontalRule().focus().run()
    }
  },
})
