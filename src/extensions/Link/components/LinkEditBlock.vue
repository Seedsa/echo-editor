<script setup lang="ts">
import { reactive, watchEffect } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Icon } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { Editor } from '@tiptap/vue-3'
import { useLocale } from '@/locales'

interface Props {
  editor: Editor
}
const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits(['onSetLink'])

const { t } = useLocale()

let form = reactive({
  text: '',
  link: '',
  openInNewTab: true,
})

watchEffect(() => {
  const { href: link, target } = props.editor.getAttributes('link')
  const { from, to } = props.editor.state.selection
  const text = props.editor.state.doc.textBetween(from, to, ' ')
  form = {
    link,
    openInNewTab: target ? (target === '_blank' ? true : false) : true,
    text,
  }
})
function handleSubmit() {
  emits('onSetLink', form.link, form.text, form.openInNewTab)
}
</script>

<template>
  <div class="p-2 bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800">
    <form @submit="handleSubmit" class="flex flex-col gap-2">
      <Label> {{ t('editor.link.dialog.text') }} </Label>
      <div class="flex w-full max-w-sm items-center gap-1.5">
        <div class="relative w-full max-w-sm items-center">
          <Input type="text" v-model="form.text" required class="w-80" placeholder="输入文本" />
        </div>
      </div>
      <Label>{{ t('editor.link.dialog.link') }}</Label>
      <div class="flex w-full max-w-sm items-center gap-1.5">
        <div class="relative w-full max-w-sm items-center">
          <Input type="url" v-model="form.link" required class="pl-10" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Icon class="size-5 text-muted-foreground" name="Link" />
          </span>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <Label>{{ t('editor.link.dialog.openInNewTab') }}</Label>
        <Switch :checked="form.openInNewTab" />
      </div>
      <Button type="submit" class="mt-2 self-end">{{ t('editor.link.dialog.button.apply') }} </Button>
    </form>
  </div>
</template>
