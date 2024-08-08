<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3'
import LinkEditBlock from '@/extensions/Link/components/LinkEditBlock.vue'
import LinkViewBlock from '@/extensions/Link/components/LinkViewBlock.vue'

interface Props {
  editor: Editor
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const showEdit = ref(false)
const link = computed(() => {
  const { href: link } = props.editor.getAttributes('link')
  return link
})
const shouldShow: any = computed(() => {
  const isActive = props.editor.isActive('link')
  return isActive
})

function onSetLink(url: string, text?: string, openInNewTab?: boolean) {
  props.editor
    .chain()
    .extendMarkRange('link')
    .insertContent({
      type: 'text',
      text: text,
      marks: [
        {
          type: 'link',
          attrs: {
            href: url,
            target: openInNewTab ? '_blank' : '',
          },
        },
      ],
    })
    .setLink({ href: url })
    .focus()
    .run()
  showEdit.value = false
}
function unSetLink() {
  props.editor.chain().extendMarkRange('link').unsetLink().focus().run()
  showEdit.value = false
}
</script>

<template>
  <BubbleMenu
    :editor="editor"
    v-show="shouldShow"
    :tippy-options="{
      popperOptions: {
        modifiers: [{ name: 'flip', enabled: false }],
      },
      appendTo: 'parent',
      placement: 'bottom-start',
      offset: [-2, 16],
      zIndex: 9999,
      onHidden: () => {
        showEdit = false
      },
    }"
  >
    <LinkEditBlock @onSetLink="onSetLink" :editor="editor" v-if="showEdit" />
    <LinkViewBlock :editor="editor" @clear="unSetLink" @edit="showEdit = true" :link="link" v-else />
  </BubbleMenu>
</template>
