import { Plugin } from 'vue'
import EchoEditor from '@/components/EchoEditor.vue'
import locale, { zhHans, en } from './locales'

const EchoEditorPlugin: Plugin = {
  install(app) {
    app.component('echo-editor', EchoEditor)
  },
}

export { en, locale, zhHans }
export * from '@/extensions'
export { useEditor } from '@tiptap/vue-3'
export { type Editor as EditorInstance } from '@tiptap/core'
export { EchoEditorPlugin, EchoEditor }

export default EchoEditorPlugin
