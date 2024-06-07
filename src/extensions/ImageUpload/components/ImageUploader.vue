<script setup lang="ts">
import { ref } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icon } from '@/components/icons'
import { useLocale } from '@/locales'
import { createImageUpload } from '@/plugins/image-upload'

const props = defineProps({
  ...nodeViewProps,
})

const link = ref<string>('')
const fileInput = ref()
const { t } = useLocale()

function handleFile(event) {
  const files = event?.target?.files
  if (!props.editor || props.editor.isDestroyed || files.length === 0) return
  const file = files[0]
  const uploadOptions = props.editor.extensionManager.extensions.find(
    extension => extension.name === 'imageUpload'
  )?.options

  const uploadFn = createImageUpload({
    validateFn: file => {
      return true
    },
    onUpload: uploadOptions.upload,
  })
  uploadFn([file], props.editor.view, props.getPos())
}
function handleLink() {
  props.editor
    .chain()
    .setImage({ src: link.value })
    .deleteRange({ from: props.getPos(), to: props.getPos() })
    .focus()
    .run()
}
function handleDelete() {
  props.deleteNode()
}
function handleClick() {
  fileInput.value?.click()
}
</script>

<template>
  <NodeViewWrapper class="p-0 m-0" data-drag-handle>
    <Popover defaultOpen modal>
      <PopoverTrigger as-child>
        <div
          class="flex items-center w-full p-3 my-3 hover:bg-accent border border-border text-muted-foreground cursor-pointer rounded-sm transition-all"
        >
          <div class="flex justify-between items-center w-full">
            <div class="flex justify-center items-center gap-3">
              <Icon name="ImageUp" class="w-6 h-6" />
              <span class="text-sm">{{ t('editor.image.dialog.title') }}</span>
            </div>
            <Icon name="Trash2" class="hover:text-foreground" @click.stop="handleDelete" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent trapFocus class="w-full" :onOpenAutoFocus="e => e.preventDefault()">
        <Tabs default-value="upload" class="w-[400px]" activationMode="manual">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="upload">{{ t('editor.image.dialog.tab.upload') }} </TabsTrigger>
            <TabsTrigger value="link"> {{ t('editor.image.dialog.tab.url') }} </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <Button class="w-full mt-1" size="sm" @click="handleClick">{{
              t('editor.image.dialog.tab.upload')
            }}</Button>
            <input type="file" accept="image/*" ref="fileInput" multiple style="display: none" @change="handleFile" />
          </TabsContent>
          <TabsContent value="link">
            <form @submit.prevent="handleLink">
              <div class="flex items-center gap-2">
                <Input
                  type="url"
                  autofocus
                  required
                  v-model="link"
                  :placeholder="t('editor.image.dialog.placeholder')"
                />
                <Button type="submit">{{ t('editor.image.dialog.button.apply') }}</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  </NodeViewWrapper>
</template>
