import type { BulletListOptions as TiptapBulletListOptions } from '@tiptap/extension-bullet-list'
import { BulletList as TiptapBulletList } from '@tiptap/extension-bullet-list'
import BulletListMenuButton from './components/BulletListMenuButton.vue'
import type { GeneralOptions } from '@/type'

export interface BulletListOptions extends TiptapBulletListOptions, GeneralOptions<BulletListOptions> { }

export const BulletList = TiptapBulletList.extend<BulletListOptions>({
  addAttributes() {
    return {
      ...this.parent?.(),
      listStyleType: {
        default: 'disc',
        parseHTML: (element: HTMLElement) => {
          const listStyleType = element.style['list-style-type' as keyof CSSStyleDeclaration] ?? 'disc'
          return { listStyleType }
        },
        renderHTML: ({ listStyleType }) => {
          return {
            style: `list-style-type: ${listStyleType?.listStyleType || listStyleType}`,
          }
        },
      },
    }
  },
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: BulletListMenuButton,
        componentProps: {
          action: () => editor?.chain().focus().toggleBulletList().run(),
          isActive: () => editor.isActive('bulletList') || false,
          disabled: !editor?.isEditable || !editor.can().toggleBulletList(),
          shortcutKeys: ['shift', 'mod', '8'],
          icon: 'List',
          tooltip: t('editor.bulletlist.tooltip'),
        },
      }),
    }
  },
})
