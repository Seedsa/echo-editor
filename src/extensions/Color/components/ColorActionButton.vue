<script setup lang="ts">
import { ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { Icon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import ActionButton from '@/components/ActionButton.vue'
import ColorPicker from '@/components/ColorPicker.vue'
import { ButtonViewReturnComponentProps } from '@/type'

interface Props {
  editor: Editor
  icon?: any
  tooltip?: string
  disabled?: boolean
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  tooltip: undefined,
  disabled: false,
  action: undefined,
  isActive: undefined,
})

const selectedColor = ref<string | undefined>(undefined)
function onChange(color: string | undefined) {
  props.action?.(color)
}

function toggleColor(e: any) {
  props.action?.(selectedColor.value)
}
</script>
<template>
  <div class="flex items-center h-[32px]">
    <ActionButton :tooltip="tooltip" :disabled="disabled" :action="toggleColor">
      <template #icon>
        <span class="text-sm flex justify-center items-center">
          <svg width="18px" height="18px" viewBox="0 0 240 240" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="icon/字体颜色" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g transform="translate(0.000000, 0.500000)">
                <g transform="translate(39.000000, 17.353553)">
                  <path
                    d="M11,201.146447 L167,201.146447 C173.075132,201.146447 178,206.071314 178,212.146447 C178,218.221579 173.075132,223.146447 167,223.146447 L11,223.146447 C4.92486775,223.146447 7.43989126e-16,218.221579 0,212.146447 C-7.43989126e-16,206.071314 4.92486775,201.146447 11,201.146447 Z"
                    id="矩形"
                    :fill="selectedColor || '#DF2A3F'"
                    fill-rule="evenodd"
                  ></path>
                  <path
                    d="M72.3425855,16.8295583 C75.799482,7.50883712 86.1577877,2.75526801 95.4785089,6.21216449 C100.284516,7.99463061 104.096358,11.7387855 105.968745,16.4968188 L106.112518,16.8745422 L159.385152,161.694068 C161.291848,166.877345 158.635655,172.624903 153.452378,174.531599 C148.358469,176.405421 142.719567,173.872338 140.716873,168.864661 L140.614848,168.598825 L89.211,28.86 L37.3759214,168.623816 C35.4885354,173.712715 29.8981043,176.351047 24.7909589,174.617647 L24.5226307,174.522368 C19.4337312,172.634982 16.7953993,167.044551 18.5287999,161.937406 L18.6240786,161.669077 L72.3425855,16.8295583 Z"
                    id="路径-21"
                    fill="currentColor"
                    fill-rule="nonzero"
                  ></path>
                  <path
                    d="M121,103.146447 C126.522847,103.146447 131,107.623599 131,113.146447 C131,118.575687 126.673329,122.994378 121.279905,123.142605 L121,123.146447 L55,123.146447 C49.4771525,123.146447 45,118.669294 45,113.146447 C45,107.717207 49.3266708,103.298515 54.7200952,103.150288 L55,103.146447 L121,103.146447 Z"
                    id="路径-22"
                    fill="currentColor"
                    fill-rule="nonzero"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        </span>
      </template>
    </ActionButton>
    <color-picker v-model="selectedColor" @change="onChange" :disabled="disabled">
      <Button variant="ghost" size="icon" class="h-[32px] w-3" :disabled="disabled">
        <Icon class="w-3 h-3 text-zinc-500" name="MenuDown" />
      </Button>
    </color-picker>
  </div>
</template>
