<script lang="ts" setup>
import type { StyleValue } from 'vue'
import { computed } from 'vue'
import { MenuCheckboxItem, MenuSeparator } from '@/components/ui/menu'
import { Editor, getMarkAttributes } from '@tiptap/vue-3'
import ActionDropdownButton from '@/components/ActionDropdownButton.vue'
import type { ButtonViewReturnComponentProps } from '@/type'
import { useLocale } from '@/locales'
export interface Item {
  title: string
  icon?: any
  level?: number
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: StyleValue
  shortcutKeys?: string[]
  disabled?: boolean
  divider?: boolean
  default?: boolean
}
interface Props {
  editor: Editor
  disabled?: boolean
  color?: string
  shortcutKeys?: string[]
  maxHeight?: string | number
  tooltip?: string
  items?: Item[]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  color: undefined,
  maxHeight: undefined,
  tooltip: '',
  shortcutKeys: undefined,
  items: () => [],
})

const { t } = useLocale()
const fontFamilyOptions = computed(() => {
  const fontFamilyOptions = props.editor.extensionManager.extensions.find(e => e.name === 'fontFamily')!.options
  const fonts = {
    [t.value('editor.fontFamily.default')]: t.value('editor.fontFamily.default'),
    ...fontFamilyOptions.fontFamilyMap,
  }
  return fonts
})
const activeFontFamily = computed(() => {
  return getMarkAttributes(props.editor.state, 'textStyle').fontFamily || t.value('editor.fontFamily.default')
})
function toggleFontType(name: string) {
  if (name === activeFontFamily.value) {
    props.editor?.chain().unsetFontFamily().focus().run()
  } else {
    props.editor?.chain().setFontFamily(name).focus().run()
  }
}
</script>

<template>
  <ActionDropdownButton :disabled="disabled" :tooltip="tooltip" :title="activeFontFamily" btn_class="min-w-24 max-w-32">
    <template v-for="(item, index) in fontFamilyOptions" :key="index">
      <MenuCheckboxItem :model-value="activeFontFamily === item" @click="toggleFontType(item)">
        <span class="ml-1 h-full" :data-font="item" :style="{ fontFamily: item ?? undefined }">
          {{ item }}
        </span>
      </MenuCheckboxItem>
      <MenuSeparator v-if="item === t('editor.fontFamily.default')" />
    </template>
  </ActionDropdownButton>
</template>
