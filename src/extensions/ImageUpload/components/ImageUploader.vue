<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icon } from '@/components/icons'
const props = defineProps({
  ...nodeViewProps,
})

const link = ref('')
const loading = ref(false)
function handleFile(event) {
  loading.value = true
  const files = event?.target?.files
  if (!props.editor || props.editor.isDestroyed || files.length === 0) return
  const file = files[0]
  const uploadOptions = props.editor.extensionManager.extensions.find(
    extension => extension.name === 'imageUpload'
  )?.options
  uploadOptions?.upload([file]).then(res => {
    props.editor
      .chain()
      .setImage({ src: res[0].src })
      .deleteRange({ from: props.getPos(), to: props.getPos() })
      .focus()
      .run()
    loading.value = false
  })
}
function handleLink() {
  props.editor
    .chain()
    .setImage({ src: link.value })
    .deleteRange({ from: props.getPos(), to: props.getPos() })
    .focus()
    .run()
}
</script>

<template>
  <NodeViewWrapper class="p-0 m-0" data-drag-handle>
    <Popover defaultOpen modal>
      <PopoverTrigger as-child>
        <div
          class="flex items-center w-full p-3 my-3 hover:bg-accent border border-border text-muted-foreground cursor-pointer rounded-sm transition-all"
        >
          <div class="flex justify-center items-center gap-3 text-s" v-if="loading">
            <Icon class="animate-spin w-6 h-6" name="LoaderCircle" />
            <span>正在上传...</span>
          </div>
          <div class="flex justify-center items-center gap-3" v-else>
            <Icon name="ImageUp" class="w-6 h-6" />
            <span class="text-sm">添加图片</span>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent trapFocus class="w-full" :onOpenAutoFocus="e => e.preventDefault()">
        <Tabs default-value="upload" class="w-[400px]" activationMode="manual">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="upload">上传 </TabsTrigger>
            <TabsTrigger value="link"> 网络图片 </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <Input id="picture" accept="image/*" type="file" @change="handleFile" />
          </TabsContent>
          <TabsContent value="link">
            <form @submit.prevent="handleLink">
              <div class="flex items-center gap-2">
                <Input type="url" autofocus required v-model="link" placeholder="请输入图片链接" />
                <Button type="submit">确认</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  </NodeViewWrapper>
</template>
