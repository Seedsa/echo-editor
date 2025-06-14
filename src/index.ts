import { Plugin } from 'vue'
import EchoEditor from '@/components/EchoEditor.vue'
import ActionButton from '@/components/ActionButton.vue'
import locale, { zhHans, en } from './locales'
import { setupIcons } from '@/components/icons/setupIcon'
import '@/styles/index.scss'
setupIcons()

const EchoEditorPlugin: Plugin = {
  install(app) {
    app.component('echo-editor', EchoEditor)
  },
}
export { en, locale, zhHans }
export * from '@/extensions'
export { useEditor } from '@tiptap/vue-3'
export type * from '@/type'
export { type Editor as EditorInstance, type JSONContent, } from '@tiptap/core'
export type { EchoEditorProps, EchoEditorEmits } from './type'
export type { Theme } from './constants'
export { useTheme } from './hooks/useTheme'
export { default as ThemeToggle } from './components/ThemeToggle.vue'
export { default as ThemePicker } from './components/ThemePicker.vue'

export { EchoEditorPlugin, EchoEditor, ActionButton }

export default EchoEditorPlugin

