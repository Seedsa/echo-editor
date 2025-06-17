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

  /** SpecialCharacter */
  specialCharacter: boolean

  /** SpellCheck */
  spellCheck: boolean

  /** SourceCode */
  sourceCode: boolean

  /** FindAndReplace */
  findAndReplace: boolean
  /** Printer */
  printer: boolean
  /** Disabled */
  disabled: boolean
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
    sourceCode: false,
    showPreview: false,
    specialCharacter: false,
    spellCheck: false,
    findAndReplace: false,
    printer: false,
    disabled: false,
  })

  const isFullscreen = computed(() => state.isFullscreen)

  function toggleFullscreen() {
    state.isFullscreen = !state.isFullscreen
  }

  function togglePreview() {
    state.showPreview = !state.showPreview
  }
  function toggleSpecialCharacter() {
    state.specialCharacter = !state.specialCharacter
  }
  function toggleSourceCode() {
    state.sourceCode = !state.sourceCode
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
  function setDisabled(disabled: boolean) {
    state.disabled = disabled
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
    toggleSpecialCharacter,
    toggleSpellCheck,
    toggleFindAndReplace,
    togglePrinter,
    toggleSourceCode,
    setDisabled,
  }
})
