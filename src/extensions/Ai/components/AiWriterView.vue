<script setup lang="ts">
import { ref, reactive } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { v4 as uuid } from 'uuid'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { Input } from '@/components/ui/input'

const props = defineProps({
  ...nodeViewProps,
})
const loading = ref(false)
const previewText = ref('')
const textareaId = uuid()

const data = reactive({
  text: '',
  tone: undefined,
  textLength: undefined,
  addHeading: false,
  language: undefined,
})
async function generate() {
  loading.value = true
  const stream = await props.extension.options.completions(data.text)
  for await (const chunk of stream) {
    previewText.value += chunk.choices[0]?.delta?.content || ''
  }
  loading.value = false
}
function discard() {
  props.deleteNode()
}
function insert() {
  const from = props.getPos()
  const to = from + props.node.nodeSize
  props.editor.chain().focus().insertContentAt({ from, to }, previewText.value).run()
}
</script>
<template>
  <NodeViewWrapper data-drag-handle as="span" class="ai-modal">
    <Card>
      <div class="flex flex-row items-center justify-between gap-1">
        <CardHeader asChild>
          <label>Prompt</label>
        </CardHeader>
      </div>
      <CardContent>
        <div class="flex flex-col p-1">
          <div v-if="loading">AI正在推理中...</div>
          <div v-if="previewText">
            <div
              class="bg-white dark:bg-black border-l-4 border-neutral-100 dark:border-neutral-700 text-black dark:text-white text-base max-h-[14rem] mb-4 ml-2.5 overflow-y-auto px-4 relative"
              v-html="previewText"
            />
          </div>
          <div>
            <Input
              :id="textareaId"
              v-model:model-value="data.text"
              placeholder="让智能助手帮我..."
              required
              class="mb-2"
            />
          </div>

          <div class="flex flex-row items-center justify-between gap-1">
            <div class="flex justify-between w-auto gap-1">
              <Button
                v-if="previewText"
                variant="ghost"
                class="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                @click="discard"
              >
                <Icon icon="mdi:delete" />
                丢弃
              </Button>
              <Button v-if="previewText" variant="ghost" @click="insert" :disabled="!previewText">
                <Icon icon="mdi:check" />
                插入
              </Button>
              <Button @click="generate" style="white-space: nowrap">
                <div v-if="previewText" class="flex items-center gap-1">
                  <Icon icon="mdi:repeat" />
                  重新生成
                </div>
                <div v-else class="flex items-center gap-1">
                  <Icon icon="mdi:magic" class="w-4 h-4" />
                  生成
                </div>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </NodeViewWrapper>
</template>
