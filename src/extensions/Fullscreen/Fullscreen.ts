import { Extension } from '@tiptap/core'

import FullscreenActionButton from './components/FullscreenActionButton.vue'

import type { GeneralOptions } from '@/type'
import { useFullscreen } from '@vueuse/core'

export interface FullscreenOptions extends GeneralOptions<FullscreenOptions> {}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fullscreen: {
      toggleFullscreen: () => ReturnType
    }
  }
}

export const Fullscreen = Extension.create<FullscreenOptions>({
  name: 'fullscreen',
  addOptions() {
    return {
      ...this.parent?.(),
      useWindow: false,
      button: ({ editor, extension, t }) => ({
        component: FullscreenActionButton,
        componentProps: {},
      }),
    }
  },
  addCommands() {
    const { toggle } = useFullscreen()
    return {
      toggleFullscreen:
        () =>
        ({ editor }) => {
          toggle()
          return true
        },
    }
  },
})
