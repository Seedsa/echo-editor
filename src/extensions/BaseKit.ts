import type { AnyExtension } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import type { CharacterCountOptions } from '@tiptap/extension-character-count'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Document } from './Document'
import type { DropcursorOptions } from '@tiptap/extension-dropcursor'
import { Dropcursor } from '@tiptap/extension-dropcursor'
import type { FocusOptions } from '@tiptap/extension-focus'
import Focus from '@tiptap/extension-focus'
import { Gapcursor } from '@tiptap/extension-gapcursor'
import type { HardBreakOptions } from '@tiptap/extension-hard-break'
import { HardBreak } from '@tiptap/extension-hard-break'
import type { ListItemOptions } from '@tiptap/extension-list-item'
import { ListItem } from '@tiptap/extension-list-item'
import type { ParagraphOptions } from '@tiptap/extension-paragraph'
import { Paragraph } from '@tiptap/extension-paragraph'
import type { PlaceholderOptions } from '@tiptap/extension-placeholder'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Text } from '@tiptap/extension-text'
import type { TextStyleOptions } from '@tiptap/extension-text-style'
import { TextStyle } from '@tiptap/extension-text-style'
import { useLocale } from '@/locales'
import { TrailingNode } from './TrailingNode/TrailingNode'
import { Selection } from './Selection/Selection'
import type { TrailingNodeOptions } from './TrailingNode/TrailingNode'
import Iframe from './Iframe/Iframe'
import type { IframeOptions } from './Iframe/Iframe'

import { TextAlign } from './TextAlign'
import type { TextAlignOptions } from './TextAlign'

import type { BubbleOptions } from '../components/menus/bubble'
import { defaultBubbleList, generateBubbleTypeMenu } from '../components/menus/bubble'

import { TextBubble } from './TextBubble'
import type { TextBubbleOptions } from './TextBubble'

import { NODE_TYPE_MENU } from '@/constants'

/**
 * Represents the interface for options in the base toolkit.
 */
export interface BaseKitOptions {
  /**
   * Whether to enable the document option
   *
   * @default true
   */
  document: false

  /**
   * Whether to enable the text option
   *
   * @default true
   */
  text: false

  /**
   * Whether to enable the Gapcursor
   *
   * @default true
   */
  gapcursor: false

  /**
   * Dropcursor options or false, indicating whether to enable the drop cursor
   *
   * @default true
   */
  dropcursor: Partial<DropcursorOptions> | false

  /**
   * character count options or false, indicating whether to enable character count
   *
   * @default true
   */
  characterCount: Partial<CharacterCountOptions> | false

  /**
   * HardBreak options or false, indicating whether to enable hard breaks
   *
   * @default true
   */
  hardBreak: Partial<HardBreakOptions> | false

  /**
   * Placeholder options or false, indicating whether to enable placeholders
   *
   * @default true
   */
  placeholder: Partial<PlaceholderOptions> | false

  /**
   * Paragraph options or false, indicating whether to enable paragraph functionality
   *
   * @default true
   */
  paragraph: Partial<ParagraphOptions> | false

  /**
   * Focus options or false, indicating whether to enable focus functionality
   *
   * @default true
   */
  focus: Partial<FocusOptions> | false

  /**
   * ListItem options or false, indicating whether to enable list item functionality
   *
   * @default true
   */
  listItem: Partial<ListItemOptions> | false

  /**
   * Text Style options or false, indicating whether to enable text style functionality
   *
   * @default true
   */
  textStyle: Partial<TextStyleOptions> | false

  /**
   * Bubble options, taking `BubbleOptions<BaseKitOptions>` as parameters, indicating whether to enable the bubble functionality
   */
  bubble: Partial<BubbleOptions<BaseKitOptions>>

  /**
   * Iframe options or false, indicating whether to enable the iframe
   *
   * @default true
   */
  iframe: Partial<IframeOptions> | false

  /**
   * Trailing node options or false, indicating whether to enable the trailing node
   *
   * @default true
   */
  trailingNode: Partial<TrailingNodeOptions> | false
  /**
   * textBubble options or false, indicating whether to enable the textBubble
   *
   * @default true
   */
  textBubble: Partial<TextBubbleOptions> | false
  /**
   * selection options or false, indicating whether to enable the selection
   *
   * @default true
   */
  selection: any | false

  /**
   * text align options or false, indicating whether to enable the text align
   *
   * @default true
   */
  textAlign: Partial<TextAlignOptions> | false
}

export const BaseKit = Extension.create<BaseKitOptions>({
  name: 'base-kit',
  addOptions() {
    return {
      ...this.parent?.(),
      bubble: {
        list: NODE_TYPE_MENU,
        defaultBubbleList,
        button: ({ editor, extension, t }) => {
          const { list = {}, defaultBubbleList } = extension.options?.bubble ?? {}
          const defaultList = defaultBubbleList?.(editor) ?? []
          return generateBubbleTypeMenu(list, defaultList, {
            editor,
            extension,
            t,
          })
        },
      },
    }
  },

  addExtensions() {
    const { t } = useLocale()
    const extensions: AnyExtension[] = []
    if (this.options.placeholder !== false) {
      extensions.push(
        Placeholder.configure({
          placeholder: ({ node, pos }) => {
            if (node?.type?.name === 'heading') {
              return `${t.value(`editor.heading.h${node.attrs.level}.tooltip`)}`
            }
            if (node?.type?.name === 'codeBlock') {
              return ''
            }
            if (pos === 0) {
              return t.value('editor.content')
            }
            return t.value('editor.slash')
          },
          ...this.options.placeholder,
        })
      )
    }

    if (this.options.focus !== false) {
      extensions.push(
        Focus.configure({
          className: 'focus',
          ...this.options.focus,
        })
      )
    }

    if (this.options.document !== false) {
      extensions.push(Document.configure())
    }

    if (this.options.text !== false) {
      extensions.push(Text.configure())
    }
    if (this.options.textBubble !== false) {
      extensions.push(TextBubble.configure())
    }

    if (this.options.gapcursor !== false) {
      extensions.push(Gapcursor.configure())
    }

    if (this.options.dropcursor !== false) {
      extensions.push(
        Dropcursor.configure({
          ...this.options.dropcursor,
          width: 2,
          class: 'ProseMirror-dropcursor border-black',
        })
      )
    }

    if (this.options.characterCount !== false) {
      extensions.push(CharacterCount.configure(this.options.characterCount))
    }

    if (this.options.paragraph !== false) {
      extensions.push(Paragraph.configure(this.options.paragraph))
    }

    if (this.options.hardBreak !== false) {
      extensions.push(HardBreak.configure(this.options.hardBreak))
    }

    if (this.options.listItem !== false) {
      extensions.push(ListItem.configure(this.options.listItem))
    }

    if (this.options.textStyle !== false) {
      extensions.push(TextStyle.configure(this.options.textStyle))
    }
    if (this.options.iframe !== false) {
      extensions.push(Iframe.configure(this.options.iframe))
    }
    if (this.options.trailingNode !== false) {
      extensions.push(TrailingNode.configure(this.options.trailingNode))
    }

    if (this.options.selection !== false) {
      extensions.push(Selection)
    }
    if (this.options.textAlign !== false) {
      extensions.push(TextAlign.configure({ types: ['heading', 'paragraph', 'image'], ...this.options.textAlign }))
    }

    return extensions
  },
})
