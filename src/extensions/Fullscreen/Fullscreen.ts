import { Extension } from '@tiptap/core'

import FullscreenActionButton from './components/FullscreenActionButton.vue'

import type { GeneralOptions } from '@/type'

export interface FullscreenOptions extends GeneralOptions<FullscreenOptions> {
  /**
   * Indicates whether to use window fullscreen mode
   *
   * @default false
   */
  useWindow: boolean
}

export const Fullscreen = Extension.create<FullscreenOptions>({
  name: 'fullscreen',
  addOptions() {
    return {
      ...this.parent?.(),
      useWindow: false,
      button: ({ editor, extension, t }) => ({
        component: FullscreenActionButton,
        componentProps: {
          useWindow: extension.options.useWindow ?? false,
        },
      }),
    }
  },
})
