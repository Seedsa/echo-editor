<script setup lang="ts">
import { watchEffect, ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { Icon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import ActionButton from '@/components/ActionButton.vue'
import ColorPicker from '../../../components/ColorPicker.vue'
import { useTiptapStore } from '@/hooks'
import type { ButtonViewReturnComponentProps } from '@/type'
import type { TooltipContentProps } from 'reka-ui'

interface Props {
  editor: Editor
  tooltip?: string
  disabled?: boolean
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
  tooltipOptions?: TooltipContentProps
}

const props = withDefaults(defineProps<Props>(), {
  tooltip: undefined,
  disabled: false,
  action: undefined,
  tooltipOptions: undefined,
  isActive: undefined,
})

const selectedColor = ref<string | undefined>(undefined)
const { state } = useTiptapStore()!

function onChange(color: string | undefined) {
  props.action?.(color)
}

function toggleColor(e: any) {
  props.action?.(selectedColor.value)
}
watchEffect(() => {
  const { color: highlightValue } = props.editor.getAttributes('highlight')
  state.highlight = highlightValue
})
</script>

<template>
  <div class="flex items-center h-[32px] hover:bg-muted rounded-md">
    <ActionButton :tooltip="tooltip" :disabled="disabled" :action="toggleColor" :tooltip-options="tooltipOptions">
      <template #icon>
        <span class="text-sm flex items-center justify-center"
          ><svg width="18px" height="18px" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="icon/填充色" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="icon/背景颜色">
                <g id="编组" fill="currentColor">
                  <g
                    transform="translate(119.502295, 137.878331) rotate(-135.000000) translate(-119.502295, -137.878331) translate(48.002295, 31.757731)"
                    id="矩形"
                  >
                    <path
                      d="M100.946943,60.8084699 L43.7469427,60.8084699 C37.2852111,60.8084699 32.0469427,66.0467383 32.0469427,72.5084699 L32.0469427,118.70847 C32.0469427,125.170201 37.2852111,130.40847 43.7469427,130.40847 L100.946943,130.40847 C107.408674,130.40847 112.646943,125.170201 112.646943,118.70847 L112.646943,72.5084699 C112.646943,66.0467383 107.408674,60.8084699 100.946943,60.8084699 Z M93.646,79.808 L93.646,111.408 L51.046,111.408 L51.046,79.808 L93.646,79.808 Z"
                      fill-rule="nonzero"
                    ></path>
                    <path
                      d="M87.9366521,16.90916 L87.9194966,68.2000001 C87.9183543,69.4147389 86.9334998,70.399264 85.7187607,70.4 L56.9423078,70.4 C55.7272813,70.4 54.7423078,69.4150264 54.7423078,68.2 L54.7423078,39.4621057 C54.7423078,37.2523513 55.5736632,35.1234748 57.0711706,33.4985176 L76.4832996,12.4342613 C78.9534987,9.75382857 83.1289108,9.5834005 85.8093436,12.0535996 C87.1658473,13.303709 87.9372691,15.0644715 87.9366521,16.90916 Z"
                      fill-rule="evenodd"
                    ></path>
                    <path
                      d="M131.3,111.241199 L11.7,111.241199 C5.23826843,111.241199 0,116.479467 0,122.941199 L0,200.541199 C0,207.002931 5.23826843,212.241199 11.7,212.241199 L131.3,212.241199 C137.761732,212.241199 143,207.002931 143,200.541199 L143,122.941199 C143,116.479467 137.761732,111.241199 131.3,111.241199 Z M124,130.241 L124,193.241 L19,193.241 L19,130.241 L124,130.241 Z"
                      fill-rule="nonzero"
                    ></path>
                  </g>
                </g>
                <path
                  d="M51,218 L205,218 C211.075132,218 216,222.924868 216,229 C216,235.075132 211.075132,240 205,240 L51,240 C44.9248678,240 40,235.075132 40,229 C40,222.924868 44.9248678,218 51,218 Z"
                  id="矩形"
                  :fill="selectedColor || '#FBDE28'"
                ></path>
              </g>
            </g></svg
        ></span>
      </template>
    </ActionButton>
    <color-picker v-model="selectedColor" @change="onChange" highlight :disabled="disabled">
      <Button
        variant="ghost"
        size="icon"
        class="w-3 h-[32px] rounded-l-none hover:bg-muted-foreground/20"
        :disabled="disabled"
      >
        <Icon class="w-3 h-3 text-zinc-500" name="MenuDown" />
      </Button>
    </color-picker>
  </div>
</template>
