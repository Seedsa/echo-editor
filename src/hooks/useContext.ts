import { reactive } from 'vue'
import type { AnyExtension } from '@tiptap/core'

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
}

const state: Instance = reactive({
  extensions: [],
}) as unknown as Instance

export function createContext(instance: Partial<Instance>) {
  state.defaultLang = instance.defaultLang
  state.extensions = instance.extensions ?? []
}

export function useContext() {
  return {
    state,
  }
}
