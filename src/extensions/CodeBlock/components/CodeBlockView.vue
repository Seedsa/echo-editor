<script lang="ts" setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { ref, computed } from 'vue'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const props = defineProps(nodeViewProps)

const languages = ref(props.extension.options.lowlight.listLanguages())

const selectedLanguage = computed({
  get() {
    return props.node.attrs.language || 'auto'
  },
  set(language: string | undefined) {
    props.updateAttributes({ language })
  },
})
</script>

<template>
  <NodeViewWrapper class="code-block relative">
    <Select v-model="selectedLanguage">
      <SelectTrigger class="w-[160px] h-8 absolute right-2 top-2 bg-background">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="auto"> Auto </SelectItem>
          <SelectSeparator />
          <SelectItem v-for="(language, index) in languages" :value="language" :key="index">
            {{ language }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <pre><code><NodeViewContent /></code></pre>
  </NodeViewWrapper>
</template>
