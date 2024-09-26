import ActionButton from '@/components/ActionButton.vue'
import { useTiptapStore } from '@/hooks'
import type { GeneralOptions } from '@/type'
import { Extension } from '@tiptap/core'
export interface PrinterOptions extends GeneralOptions<PrinterOptions> {}

const { togglePrinter, state } = useTiptapStore()
export const Printer = Extension.create<PrinterOptions>({
  name: 'printer',
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, extension, t }) => ({
        component: ActionButton,
        componentProps: {
          tooltip: t('editor.printer.tooltip'),
          action: () => togglePrinter(),
          icon: 'Printer',
          shortcutKeys: ['mod', 'P'],
          isActive: () => state.printer,
        },
      }),
    }
  },
})
