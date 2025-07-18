import type { Extension } from '@tiptap/core'
import type { HeadingOptions as TiptapHeadingOptions } from '@tiptap/extension-heading'
import { Heading as TiptapHeading } from '@tiptap/extension-heading'

import type { Item } from './types'

import HeadingButton from './components/HeadingButton.vue'

import type { BaseKitOptions } from '../BaseKit'

import type { GeneralOptions } from '@/type'

export interface HeadingOptions extends TiptapHeadingOptions, GeneralOptions<HeadingOptions> { }

export const Heading = TiptapHeading.extend<HeadingOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      levels: [1, 2, 3, 4, 5, 6],
      button({ editor, extension, t }) {
        const { extensions = [] } = editor.extensionManager ?? []
        const levels = extension.options?.levels || []
        const baseKitExt = extensions.find(k => k.name === 'base-kit') as Extension<BaseKitOptions>

        const items: Item[] = levels.map(level => ({
          action: () => editor?.chain().toggleHeading({ level }).focus().run(),
          isActive: () => editor.isActive('heading', { level }) || false,
          disabled: !editor?.isEditable || !editor.can().toggleHeading({ level }),
          title: t(`editor.heading.h${level}.tooltip`),
          level: level,
          shortcutKeys: ['alt', 'mod', `${level}`],
        }))
        if (baseKitExt && baseKitExt.options.paragraph !== false) {
          items.unshift({
            action: () => editor?.chain().setParagraph().focus().run(),
            isActive: () => editor.isActive('paragraph') || false,
            disabled: !editor?.isEditable || !editor.can().setParagraph(),
            level: 0,
            title: t('editor.paragraph.tooltip'),
            shortcutKeys: ['alt', 'mod', '0'],
          })
        }

        const disabled = items.filter((k: any) => k.disabled).length === items.length

        return {
          component: HeadingButton,
          componentProps: {
            tooltip: t('editor.heading.tooltip'),
            disabled,
            items,
          },
        }
      },
    }
  },
})
