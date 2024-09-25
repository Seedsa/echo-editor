<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import type { Editor } from '@tiptap/core'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Icon } from '@/components/icons'
import { useTiptapStore } from '@/hooks'
import { useLocale } from '@/locales'
import { ScrollArea } from '@/components/ui/scroll-area'
interface Props {
  editor: Editor
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})
const { t } = useLocale()
const store = useTiptapStore()
const resizableRef = ref<InstanceType<typeof ResizablePanel>>()

function openChange(e: boolean) {
  store!.state.showPreview = e
}
function handleClose() {
  store!.state.showPreview = false
}
const currentEditorContent = computed(() => {
  return props.editor.getHTML()
})
</script>

<template>
  <Dialog :open="store?.state.showPreview" @update:open="openChange">
    <DialogContent
      class="sm:max-w-[425px] md:max-w-[825px] lg:max-w-[1200px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
    >
      <DialogHeader class="p-6 pb-0">
        <DialogTitle>{{ t('editor.preview.tooltip') }}</DialogTitle>
        <div class="flex justify-center">
          <div class="hidden items-center gap-1.5 rounded-md border p-[2px] shadow-sm md:flex">
            <ToggleGroup
              type="single"
              default-value="100"
              @update:model-value="
                value => {
                  resizableRef?.resize(parseInt(value))
                }
              "
            >
              <ToggleGroupItem value="100" class="h-[32px] w-[32px] rounded-sm p-0">
                <Icon name="Monitor" class="w-5 h-5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="60" class="h-[32px] w-[32px] rounded-sm p-0">
                <Icon name="Tablet" class="w-5 h-5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="30" class="h-[32px] w-[32px] rounded-sm p-0">
                <Icon name="Phone" class="w-5 h-5" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </DialogHeader>
      <div
        class="relative overflow-y-auto after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-lg h-[--container-height] px-4"
      >
        <ResizablePanelGroup id="preview-resizable" direction="horizontal" class="relative z-10 overflow-auto">
          <ResizablePanel
            ref="resizableRef"
            class="relative rounded-lg border bg-background transition-all"
            :default-size="100"
            :min-size="30"
            id="preview-resize-panel-1"
          >
            <ScrollArea class="h-full w-full rounded-md border p-3 border-none">
              <div v-html="currentEditorContent" class="ProseMirror" />
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle
            id="block-resizable-handle"
            class="relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 sm:block"
          />
          <ResizablePanel id="block-resizable-panel-2" :default-size="0" :min-size="0" />
        </ResizablePanelGroup>
      </div>
      <DialogFooter class="p-2 pt-0">
        <Button @click="handleClose"> {{ t('editor.close') }} </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style></style>
