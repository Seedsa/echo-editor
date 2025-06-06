<script lang="ts" setup>
import { isActive, type Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { getRenderContainer } from '@/utils/getRenderContainer'
import { useLocale } from '@/locales'
import { deleteSelection } from '@tiptap/pm/commands'

interface Props {
  editor: Editor
  disabled?: boolean
}
type ImageAlignments = 'left' | 'center' | 'right'

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})
const { t } = useLocale()
const imagePercent = ref('100')
const width = ref()
const height = ref()
const aspectRatio = ref()
const imageAlign: ImageAlignments[] = ['left', 'center', 'right']
const alignIconMap: any = {
  left: 'AlignLeft',
  center: 'AlignCenter',
  right: 'AlignRight',
}

function updateImageSize(event?: Event) {
  event?.preventDefault()
  const imageAttrs = props.editor.getAttributes('image')
  if (imageAttrs.src) {
    props.editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .updateImage({
        width: width.value ? `${width.value}px` : null,
      })
      .run()
  }
}
function changeImagePercent(event?: any) {
  event?.preventDefault()
  const percent = Math.max(0, Math.min(100, parseInt(imagePercent.value)))
  props.editor
    .chain()
    .focus(undefined, { scrollIntoView: false })
    .updateImage({ width: `${percent}%` })
    .run()
}
const shouldShow = ({ editor }) => isActive(editor.view.state, 'image')

const getReferenceClientRect = computed(() => {
  const renderContainer = getRenderContainer(props.editor, 'node-image')
  return renderContainer?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0)
})

function setImageAlign(align: ImageAlignments) {
  props.editor.chain().focus().setTextAlign(align).run()
}
watch(imagePercent, () => {
  if (imagePercent.value) {
    changeImagePercent()
  }
})

watch(
  () => props.editor.getAttributes('image'),
  image => {
    if (image) {
      width.value = Math.round(parseFloat(image.originWidth))
      height.value = Math.round(parseFloat(image.originHeight))
      aspectRatio.value = image.originWidth / image.originHeight
    }
  }
)
function updateWidthFromHeight() {
  if (height.value && aspectRatio.value) {
    width.value = Math.max(30, Math.round(height.value * aspectRatio.value))
  } else {
    width.value = null
  }
}
function updateHeightFromWidth() {
  if (width.value && aspectRatio.value) {
    height.value = Math.max(20, Math.round(width.value / aspectRatio.value))
  } else {
    height.value = null
  }
}
function handleSetImageAlign(align: ImageAlignments) {
  setImageAlign(align)
}
function handleFlipX() {
  const image = props.editor.getAttributes('image')
  const { flipX } = image
  props.editor
    .chain()
    .focus(undefined, { scrollIntoView: false })
    .updateImage({
      flipX: !flipX,
    })
    .run()
}
function handleFlipY() {
  const image = props.editor.getAttributes('image')
  const { flipY } = image
  props.editor
    .chain()
    .focus(undefined, { scrollIntoView: false })
    .updateImage({
      flipY: !flipY,
    })
    .run()
}

function handleRemove() {
  const { state, dispatch } = props.editor.view
  deleteSelection(state, dispatch)
}
</script>
<template>
  <BubbleMenu :editor="editor" pluginKey="image-menus-123" :shouldShow="shouldShow" :updateDelay="0">
    <div
      class="border border-neutral-200 dark:border-neutral-800 px-3 py-2 transition-all select-none pointer-events-auto shadow-sm rounded-sm w-auto bg-background"
    >
      <div class="flex items-center flex-nowrap whitespace-nowrap h-[26px] justify-start relative gap-0.5">
        <ActionButton :tooltip="t('editor.image.menu.flipX')" icon="FlipVertical" :action="handleFlipX" />
        <ActionButton :tooltip="t('editor.image.menu.flipY')" icon="FlipHorizontal" :action="handleFlipY" />
        <Separator orientation="vertical" class="mx-1 me-2 h-[16px]" />
        <Popover>
          <PopoverTrigger>
            <ActionButton :title="t('editor.image.menu.size')" icon="ImageSize" />
          </PopoverTrigger>
          <PopoverContent class="w-84">
            <div class="flex items-center gap-2">
              <Label for="maxWidth" class="whitespace-nowrap">{{ t('editor.image.menu.size.width') }}</Label>
              <Input
                id="maxWidth"
                v-model="width"
                type="number"
                @input="updateHeightFromWidth"
                @keyup.enter="updateImageSize"
                class="w-20 h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Label for="maxWidth" class="whitespace-nowrap">{{ t('editor.image.menu.size.height') }}</Label>
              <Input
                id="maxWidth"
                v-model="height"
                type="number"
                @input="updateWidthFromHeight"
                @keyup.enter="updateImageSize"
                class="w-20 h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div class="mt-3">
              <Tabs
                v-model:model-value="imagePercent"
                @update:model-value="
                  value => {
                    imagePercent = value as string
                  }
                "
              >
                <TabsList>
                  <TabsTrigger v-for="value in ['25', '50', '75', '100']" :key="value" :value="value">
                    {{ value }}%
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </PopoverContent>
        </Popover>
        <Separator orientation="vertical" class="mx-1 me-2 h-[16px]" />
        <ActionButton
          v-for="(item, index) in imageAlign"
          :key="index"
          :tooltip="t(`editor.textalign.${item}.tooltip`)"
          :icon="alignIconMap[item]"
          :action="() => handleSetImageAlign(item)"
          :disabled="!editor.can().setTextAlign(item)"
          :is-active="() => editor.isActive({ textAlign: item }) || false"
        />
        <Separator orientation="vertical" class="mx-1 me-2 h-[16px]" />
        <ActionButton
          :tooltip="t('editor.remove')"
          icon="Trash2"
          :action="handleRemove"
          :disabled="!editor.isEditable"
        />
      </div>
    </div>
  </BubbleMenu>
</template>
