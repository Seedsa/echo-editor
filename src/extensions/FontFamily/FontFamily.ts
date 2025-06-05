import {
  FontFamilyOptions as TiptapFontFamilyOptions,
  FontFamily as TiptapFontFamily,
} from "@tiptap/extension-text-style";

import FontFamilyButton from './components/FontFamilyMenuButton.vue'
import type { GeneralOptions } from '@/type'
import { DEFAULT_FONT_FAMILY_MAP } from '@/constants'

export interface FontFamilyOptions extends TiptapFontFamilyOptions, GeneralOptions<FontFamilyOptions> {
  fontFamilyMap: {
    [key: string]: string
  }
}
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontFamily: {
      /**
       * Set the text font family.
       * CSS font-size
       *
       */
      setFontFamily: (fontFamily: string) => ReturnType
      /**
       * Unset the font family
       */
      unsetFontFamily: () => ReturnType
    }
  }
}

export const FontFamily = TiptapFontFamily.extend<FontFamilyOptions>({
  name: 'fontFamily',
  addOptions() {
    return {
      ...this.parent?.(),
      types: ['textStyle'],
      fontFamilyMap: DEFAULT_FONT_FAMILY_MAP,
      button({ editor, extension, t }) {
        return {
          component: FontFamilyButton,
          componentProps: {
            editor,
            disabled: !editor?.isEditable || !editor.can().setFontFamily(''),
            tooltip: t('editor.fontFamily.tooltip'),
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
          fontFamily: {
            default: null,
            parseHTML: element => element.style.fontFamily.replace(/['"]/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontFamily) {
                return {}
              }
              return {
                style: `font-family: ${attributes.fontFamily}`,
              }
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontFamily:
        fontFamily =>
          ({ chain }) => {
            return chain().setMark('textStyle', { fontFamily }).run()
          },
      unsetFontFamily:
        () =>
          ({ chain }) => {
            return chain().setMark('textStyle', { fontFamily: null }).removeEmptyTextStyle().run()
          },
    }
  },
})
