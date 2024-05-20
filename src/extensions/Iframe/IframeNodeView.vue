<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getExampleUrl, getServiceSrc } from './embed'
const props = defineProps({
  ...nodeViewProps,
})
const originalLink = ref<string>('')
const showEdit = ref<boolean>(true)

const src = computed({
  get: () => props.node.attrs.src,
  set: (value: string) => {
    originalLink.value = value
    props.updateAttributes({ src: value })
  },
})
function handleConfirm() {
  console.log(originalLink.value, props.node.attrs.service, originalLink.value)
  let result = getServiceSrc(props.node.attrs.service, originalLink.value)
  // 校验链接合法
  console.log(result)
  if (result.validLink && result.validId) {
    src.value = result.src
    showEdit.value = false
  } else {
    console.log('暂不支持')
  }
}
function handleExmaple() {
  const url = getExampleUrl(props.node.attrs.service)
  if (url) {
    originalLink.value = url
  }
}
onMounted(() => {
  originalLink.value = props.node.attrs.src
})
</script>

<template>
  <NodeViewWrapper as="section">
    <div class="flex flex-row relative items-center" v-if="showEdit">
      <Input v-model:model-value="originalLink" type="url" class="h-12 pr-40" autofocus placeholder="输入链接"> </Input>
      <div class="flex gap-2 absolute right-1 w-36">
        <Button @click="handleExmaple" variant="outline">示例</Button>
        <Button type="primary" @click="handleConfirm">确认</Button>
      </div>
    </div>
    <iframe
      v-if="src"
      class="w-full border border-border mt-2 rounded-sm"
      :src="src"
      frameborder="0"
      allowfullscreen="true"
      :style="{ height: `${node.attrs.height || 400}px` }"
    ></iframe>
  </NodeViewWrapper>
</template>
