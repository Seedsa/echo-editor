import { computed, reactive, watchEffect } from 'vue'
import type { AnyExtension } from '@tiptap/core'
import { createInjectionState } from '@vueuse/core'
import { useContext } from './useContext'

import { DEFAULT_LANG_VALUE } from '@/constants'

/**
 * Interface representing an tiptap editor instance.
 */
interface Instance {
  /**
   * List of extensions
   *
   * @default []
   */
  extensions: AnyExtension[]

  /**
   * Default language setting
   *
   * @default DEFAULT_LANG_VALUE
   */
  defaultLang?: string

  /**
   * Whether it is in fullscreen mode
   *
   * @default false
   */
  isFullscreen: boolean

  /** Text color */
  color?: string

  /** Highlight color */
  highlight?: string
}

export const [useProvideTiptapStore, useTiptapStore] = createInjectionState(() => {
  const { state: _state } = useContext()

  const state: Instance = reactive({
    extensions: _state.extensions ?? [],
    defaultLang: DEFAULT_LANG_VALUE,
    isFullscreen: false,
    color: undefined,
    highlight: undefined,
  })

  const isFullscreen = computed(() => state.isFullscreen)

  function toggleFullscreen() {
    state.isFullscreen = !state.isFullscreen
  }

  watchEffect(() => {
    state.extensions = _state.extensions
    state.defaultLang = _state.defaultLang
  })

  return {
    state,
    isFullscreen,
    toggleFullscreen,
  }
})
