<script setup lang="ts">
import { watchEffect } from 'vue'
import { Switch } from '@/components/ui/switch'
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Icon } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import * as z from 'zod'
import type { Editor } from '@tiptap/vue-3'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useLocale } from '@/locales'

interface Props {
  editor: Editor
}
const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits(['onSetLink'])

const { t } = useLocale()

const formSchema = toTypedSchema(
  z.object({
    text: z.string({ message: '请输入文本' }),
    link: z.string({ message: '请输入链接' }).url({ message: '链接格式不正确' }),
    openInNewTab: z.boolean().default(true).optional(),
  })
)
const { isFieldDirty, handleSubmit, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    openInNewTab: true,
  },
})

watchEffect(() => {
  const { href: link, target } = props.editor.getAttributes('link')
  const { from, to } = props.editor.state.selection
  const text = props.editor.state.doc.textBetween(from, to, ' ')
  setValues({
    link,
    openInNewTab: target ? (target === '_blank' ? true : false) : true,
    text,
  })
})
const onSubmit = handleSubmit(values => {
  emits('onSetLink', values.link, values.text, values.openInNewTab)
})
</script>

<template>
  <div class="p-2 bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800">
    <form @submit="onSubmit" class="flex flex-col gap-2">
      <FormField v-slot="{ componentField }" name="text" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <FormLabel> 文本 </FormLabel>
          <FormControl>
            <div class="flex w-full max-w-sm items-center gap-1.5">
              <div class="relative w-full max-w-sm items-center">
                <Input v-bind="componentField" type="text" class="w-80" placeholder="输入链接" />
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="link" :validate-on-blur="!isFieldDirty">
        <FormItem class="mt-2">
          <FormLabel> 链接 </FormLabel>
          <FormControl>
            <div class="flex w-full max-w-sm items-center gap-1.5">
              <div class="relative w-full max-w-sm items-center">
                <Input v-bind="componentField" type="text" placeholder="输入链接" class="pl-10" />
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                  <Icon class="size-6 text-muted-foreground" name="Link" />
                </span>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ value, handleChange }" name="openInNewTab" :validate-on-blur="!isFieldDirty">
        <FormItem class="mt-2">
          <FormControl>
            <div class="flex items-center space-x-2">
              <Label>是否在新窗口打开</Label>
              <Switch :checked="value" @update:checked="handleChange" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit" class="mt-2 self-end">{{ t('editor.link.dialog.button.apply') }} </Button>
    </form>
  </div>
</template>
