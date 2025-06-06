<script setup lang="ts">
import { computed, ref } from 'vue'
import { isActive, isMarkActive, type Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import LinkEditBlock from '@/extensions/Link/components/LinkEditBlock.vue'
import LinkViewBlock from '@/extensions/Link/components/LinkViewBlock.vue'
import { TextSelection } from '@tiptap/pm/state'

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

const shouldShow = ({ editor }) => editor.isActive('link')

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
function onClickOutside() {
  const { state, view } = props.editor
  const { tr, selection } = state
  const transaction = tr.setSelection(TextSelection.create(state.doc, selection.from))
  view.dispatch(transaction)
  showEdit.value = false
}
</script>

<template>
  <BubbleMenu v-if="editor" :editor="editor" :should-show="shouldShow">
    <div>
      <LinkEditBlock @onSetLink="onSetLink" @on-click-outside="onClickOutside" :editor="editor" v-if="showEdit" />
      <LinkViewBlock :editor="editor" @clear="unSetLink" @edit="showEdit = true" :link="link" v-else />
    </div>
  </BubbleMenu>
</template>
