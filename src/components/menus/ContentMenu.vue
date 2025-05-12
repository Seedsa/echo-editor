<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@/components/icons'
import { DragHandlePlugin } from '@/plugins/DragHandle'
import { Button } from '@/components/ui/button'
import { Node } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/vue-3'
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'
import { useLocale } from '@/locales'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { IndentProps, setNodeIndentMarkup } from '@/utils/indent'
import { getShortcutKeys } from '@/utils/plateform'
import { hasExtension } from '@/utils/utils'

type PluginRefType = Plugin<{
  locked: boolean
}>

interface Props {
  className?: string
  editor: Editor
  disabled?: boolean
  pluginKey?: PluginKey | string
}

const props = withDefaults(defineProps<Props>(), {
  className: 'drag-handle',
  disabled: false,
  pluginKey: 'ContentItemMenu',
})
const { t } = useLocale()

const dragElement = ref(null)
const pluginRef = ref<PluginRefType | null>(null)
const currentNode = ref<Node | null>(null)
const currentNodePos = ref<number>(-1)
const menuOpen = ref(false)

onMounted(() => {
  if (dragElement.value && !props.editor.isDestroyed) {
    // 初始化并注册插件
    pluginRef.value = DragHandlePlugin({
      editor: props.editor,
      element: dragElement.value,
      pluginKey: props.pluginKey,
      tippyOptions: {
        offset: [-2, 16],
        zIndex: 9,
        moveTransition: 'transform 0.15s ease-out',
      },
      onNodeChange: handleNodeChange,
    })

    props.editor.registerPlugin(pluginRef.value)
  }
})

onUnmounted(() => {
  if (pluginRef.value) {
    props.editor.unregisterPlugin(props.pluginKey)
  }
})
function resetTextFormatting() {
  const chain = props.editor.chain()
  chain.setNodeSelection(currentNodePos.value).unsetAllMarks()
  if (currentNode.value?.type.name !== 'paragraph') {
    chain.setParagraph()
  }
  chain.run()
}
function copyNodeToClipboard() {
  props.editor.commands.setNodeSelection(currentNodePos.value)
  // TODO API已被弃用 可能会导致不生效
  document.execCommand('copy')
}
function duplicateNode() {
  props.editor.commands.setNodeSelection(currentNodePos.value)
  const { $anchor } = props.editor.state.selection
  const selectedNode = $anchor.node(1) || (props.editor.state.selection as NodeSelection).node
  props.editor
    .chain()
    .setMeta('hideDragHandle', true)
    .insertContentAt(currentNodePos.value + (currentNode.value?.nodeSize || 0), selectedNode.toJSON())
    .focus()
    .run()
}
function setTextAlign(alignments: string) {
  props.editor.chain().setTextAlign(alignments).run()
}
function increaseIndent() {
  const indentTr = setNodeIndentMarkup(props.editor.state.tr, currentNodePos.value, 1)
  indentTr.setMeta('hideDragHandle', true)
  props.editor.view.dispatch && props.editor.view.dispatch(indentTr)
}
function decreaseIndent() {
  const tr = setNodeIndentMarkup(props.editor.state.tr, currentNodePos.value, -1)
  props.editor.view.dispatch && props.editor.view.dispatch(tr)
}

function deleteNode() {
  props.editor.chain().setMeta('hideDragHandle', true).setNodeSelection(currentNodePos.value).deleteSelection().run()
}

function handleNodeChange(e) {
  if (e.node) {
    currentNode.value = e.node
  }
  currentNodePos.value = e.pos
}
function handleAdd() {
  if (!props.editor.isEditable) {
    return
  }
  if (currentNodePos.value !== -1) {
    const currentNodeSize = currentNode.value?.nodeSize || 0
    const insertPos = currentNodePos.value + currentNodeSize
    const currentNodeIsEmptyParagraph =
      currentNode.value?.type.name === 'paragraph' && currentNode.value?.content?.size === 0
    const focusPos = currentNodeIsEmptyParagraph ? currentNodePos.value + 2 : insertPos + 2
    props.editor
      .chain()
      .command(({ dispatch, tr, state }) => {
        if (dispatch) {
          if (currentNodeIsEmptyParagraph) {
            tr.insertText('/', currentNodePos.value, currentNodePos.value + 1)
          } else {
            tr.insert(insertPos, state.schema.nodes.paragraph.create(null, [state.schema.text('/')]))
          }

          return dispatch(tr)
        }

        return true
      })
      .focus(focusPos)
      .run()
  }
}
watch(
  () => menuOpen.value,
  val => {
    if (val) {
      // 显示时锁定drop handle
      props.editor.commands.setHighlightParagraph(currentNodePos.value)
      props.editor.commands.setMeta('lockDragHandle', true)
    } else {
      props.editor.commands.clearHighlightParagraph()
      props.editor.commands.setMeta('lockDragHandle', false)
    }
  }
)

watch(
  () => props.editor.isDestroyed,
  isDestroyed => {
    if (isDestroyed && pluginRef.value) {
      props.editor.unregisterPlugin(props.pluginKey)
      pluginRef.value = null
    }
  }
)
</script>
<template>
  <div
    :class="className"
    v-show="!disabled"
    ref="dragElement"
    style="transition-property: top, left; transition-timing-function: ease-in-out; transition-duration: 0.2s"
  >
    <div
      class="flex items-center gap-0.5"
      style="transition-property: top, left; transition-timing-function: ease-in-out; transition-duration: 0.2s"
    >
      <Button
        v-if="hasExtension(editor, 'slashCommand')"
        variant="ghost"
        @click="handleAdd"
        size="icon"
        class="w-7 h-7 cursor-grab rounded-sm"
        :disabled="disabled"
      >
        <Icon name="Plus" class="text-lg text-neutral-600 dark:text-neutral-200" />
      </Button>
      <DropdownMenu v-model:open="menuOpen">
        <DropdownMenuTrigger :disable="disabled">
          <TooltipProvider :delay-duration="0">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="ghost" size="icon" class="w-6 h-7 cursor-grab rounded-sm" :disabled="disabled">
                  <Icon name="Grip" class="text-sm dark:text-neutral-200 text-neutral-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{{ t('editor.draghandle.tooltip') }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-48" align="start" side="bottom">
          <DropdownMenuItem
            @click="deleteNode"
            class="flex gap-3 focus:text-red-500 focus:bg-red-400 hover:bg-red-400 dark:hover:text-red-500 bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-30 dark:hover:bg-opacity-20"
          >
            <Icon name="Trash2" />
            <span>{{ t('editor.remove') }}</span>
          </DropdownMenuItem>
          <DropdownMenuItem class="flex gap-3" @click="resetTextFormatting">
            <Icon name="PaintRoller" />
            <span>{{ t('editor.clear.tooltip') }}</span>
          </DropdownMenuItem>
          <DropdownMenuItem class="flex gap-3" @click="copyNodeToClipboard">
            <Icon name="Clipboard" />
            <span>{{ t('editor.copyToClipboard') }}</span>
          </DropdownMenuItem>
          <DropdownMenuItem class="flex gap-3" @click="duplicateNode">
            <Icon name="Copy" />
            <span>{{ t('editor.copy') }}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator v-if="hasExtension(editor, 'textAlign') || hasExtension(editor, 'indent')" />
          <DropdownMenuSub v-if="hasExtension(editor, 'textAlign')">
            <DropdownMenuSubTrigger class="flex gap-3">
              <Icon name="AlignCenter" />
              <span>{{ t('editor.textalign.tooltip') }}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal to=".echo-editor">
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem
                  :model-value="editor.isActive({ textAlign: 'left' }) ?? false"
                  class="flex gap-3"
                  @click="setTextAlign('left')"
                >
                  <Icon name="AlignLeft" />
                  <span>{{ t('editor.textalign.left.tooltip') }}</span>
                  <span class="ml-auto text-xs text-neutral-400">{{ getShortcutKeys(['Mod', 'Shift', 'L']) }}</span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  :model-value="editor.isActive({ textAlign: 'center' }) ?? false"
                  class="flex gap-3"
                  @click="setTextAlign('center')"
                >
                  <Icon name="AlignCenter" />
                  <span>{{ t('editor.textalign.center.tooltip') }}</span>
                  <span class="ml-auto text-xs text-neutral-400">{{ getShortcutKeys(['Mod', 'Shift', 'E']) }}</span>
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  :model-value="editor.isActive({ textAlign: 'right' }) ?? false"
                  class="flex gap-3"
                  @click="setTextAlign('right')"
                >
                  <Icon name="AlignRight" />
                  <span>{{ t('editor.textalign.right.tooltip') }}</span>
                  <span class="ml-auto text-xs text-neutral-400">{{ getShortcutKeys(['Mod', 'Shift', 'R']) }}</span>
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub v-if="hasExtension(editor, 'indent')">
            <DropdownMenuSubTrigger class="flex gap-3">
              <Icon name="IndentIncrease" />
              <span>{{ t('editor.indent') }}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal to=".echo-editor">
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  class="flex gap-3"
                  @click="increaseIndent"
                  :disabled="currentNode?.attrs?.indent >= IndentProps.max"
                >
                  <Icon name="IndentIncrease" />
                  <span>{{ t('editor.indent.tooltip') }}</span>
                  <span class="ml-auto text-xs text-neutral-400">{{ getShortcutKeys(['Tab']) }}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  class="flex gap-3"
                  @click="decreaseIndent"
                  :disabled="currentNode?.attrs?.indent <= IndentProps.min"
                >
                  <Icon name="IndentDecrease" />
                  <span>{{ t('editor.outdent.tooltip') }}</span>
                  <span class="ml-auto text-xs text-neutral-400">{{ getShortcutKeys(['Shift', 'Tab']) }}</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
