import { computed, reactive, watchEffect, ComputedRef } from 'vue'
import type { AnyExtension } from '@tiptap/core'
import { createGlobalState } from '@vueuse/core'
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

  /** AI Menu visibility */
  AIMenu: boolean

  /** Preview visibility */
  showPreview: boolean

  /** SpellCheck */
  spellCheck: boolean

  /** FindAndReplace */
  findAndReplace: boolean
  /** Printer */
  printer: boolean
}

export const useTiptapStore = createGlobalState(() => {
  const { state: _state } = useContext()

  const state: Instance = reactive({
    extensions: _state.extensions ?? [],
    defaultLang: DEFAULT_LANG_VALUE,
    isFullscreen: false,
    color: undefined,
    highlight: undefined,
    AIMenu: false,
    showPreview: false,
    spellCheck: false,
    findAndReplace: false,
    printer: false,
  })

  const isFullscreen = computed(() => state.isFullscreen)

  function toggleFullscreen() {
    state.isFullscreen = !state.isFullscreen
  }

  function togglePreview() {
    state.showPreview = !state.showPreview
  }
  function toggleSpellCheck() {
    state.spellCheck = !state.spellCheck
  }
  function toggleFindAndReplace() {
    state.findAndReplace = !state.findAndReplace
  }
  function togglePrinter() {
    state.printer = !state.printer
  }

  watchEffect(() => {
    state.extensions = _state.extensions
    state.defaultLang = _state.defaultLang
  })

  return {
    state,
    isFullscreen,
    toggleFullscreen,
    togglePreview,
    toggleSpellCheck,
    toggleFindAndReplace,
    togglePrinter,
  }
})
