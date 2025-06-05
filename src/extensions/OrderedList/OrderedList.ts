import {
  OrderedListOptions as TiptapOrderedListOptions,
  OrderedList as TiptapOrderedList,
} from "@tiptap/extension-list";

import OrderedListMenuButton from './components/OrderedListMenuButton.vue'

import type { GeneralOptions } from '@/type'

export interface OrderedListOptions extends TiptapOrderedListOptions, GeneralOptions<OrderedListOptions> { }

export const OrderedList = TiptapOrderedList.extend<OrderedListOptions>({
  addAttributes() {
    return {
      ...this.parent?.(),
      listType: {
        default: 'decimal',
        parseHTML: (element: HTMLElement) => {
          element.style.getPropertyValue('list-style-type') || 'decimal'
        },
        renderHTML: ({ listType }) => {
          return {
            style: `list-style-type: ${listType}`,
          }
        },
      },
    }
  },
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: OrderedListMenuButton,
        componentProps: {
          action: () => editor.chain().toggleOrderedList().focus().run(),
          isActive: () => editor.isActive('orderedList') || false,
          disabled: !editor.isEditable || !editor.can().toggleOrderedList(),
          icon: 'ListOrdered',
          shortcutKeys: ['mod', 'shift', '7'],
          tooltip: t('editor.orderedlist.tooltip'),
        },
      }),
    }
  },
})
