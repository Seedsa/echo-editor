<script setup lang="ts">
import { computed, unref } from 'vue'
import { Editor } from '@tiptap/core'
import { useLocale } from '@/locales'
import type { ButtonViewReturn } from '@/type'
import { Separator } from '@/components/ui/separator'
import { isFunction } from '@/utils/utils'
interface Menu {
  button: ButtonViewReturn
  divider: boolean
  spacer: boolean
}
interface Props {
  editor: Editor
  disabled?: boolean
}
const { t } = useLocale()

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const items = computed(() => {
  const extensions = [...props.editor.extensionManager.extensions]
  const sortExtensions = extensions.sort((arr, acc) => {
    const a = arr.options.sort ?? -1
    const b = acc.options.sort ?? -1
    return a - b
  })

  let menus: Menu[] = []

  for (const extension of sortExtensions) {
    const { button, divider = false, spacer = false, toolbar = true } = extension.options
    if (!button || !isFunction(button) || !toolbar) continue

    const _button: ButtonViewReturn = button({
      editor: props.editor,
      extension,
      t: unref(t),
    })

    if (Array.isArray(_button)) {
      const menu: Menu[] = _button.map((k, i) => ({
        button: k,
        divider: i === _button.length - 1 ? divider : false,
        spacer: i === 0 ? spacer : false,
      }))
      menus = [...menus, ...menu]
      continue
    }

    menus.push({ button: _button, divider, spacer })
  }
  return menus
})
</script>

<template>
  <div class="sticky top-0 h-auto bg-background z-10 overflow-visible rounded-t-[0.5rem]" v-if="items.length">
    <div class="flex flex-nowrap overflow-x-auto sm:flex-wrap gap-y-1 gap-x-1 items-center py-0.5">
      <template v-for="(item, key) in items" :key="key">
        <div class="flex items-center">
          <Separator v-if="item.spacer" orientation="vertical" class="h-[16px] mx-[10px]" />
        </div>
        <component
          :is="item.button.component"
          v-bind="item.button.componentProps"
          :editor="editor"
          :disabled="disabled || item.button.componentProps?.disabled"
        >
          <template v-for="(element, slotName, i) in item.button.componentSlots" :key="i" #[`${slotName}`]="values">
            <component :is="element" v-bind="values?.props" />
          </template>
        </component>
        <Separator v-if="item.divider" orientation="vertical" class="h-auto mx-2" />
      </template>
    </div>
  </div>
</template>
