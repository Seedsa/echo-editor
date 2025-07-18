<script setup lang="ts">
import { computed, ref, unref, onMounted, onBeforeUnmount } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { IMAGE_MAX_SIZE, IMAGE_MIN_SIZE, IMAGE_THROTTLE_WAIT_TIME } from '@/constants'
import { clamp, isNumber, throttle } from '@/utils/utils'

const props = defineProps({
  ...nodeViewProps,
  selected: {
    type: Boolean,
    required: true,
  },
})

type Size = {
  width: number
  height: number
}

const ResizeDirection = {
  TOP_LEFT: 'tl',
  TOP_RIGHT: 'tr',
  BOTTOM_LEFT: 'bl',
  BOTTOM_RIGHT: 'br',
}

const maxSize = ref<Size>({ width: IMAGE_MAX_SIZE, height: IMAGE_MAX_SIZE })
const originalSize = ref<Size>({ width: 0, height: 0 })
const resizing = ref(false)

const resizerState = ref<{ x: number; y: number; w: number; h: number; dir: string }>({
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  dir: '',
})

const imgAttrs = computed(() => {
  const { src, alt, width, height, flipX, flipY } = props.node.attrs
  const transformStyles: any = []
  if (flipX) transformStyles.push('rotateX(180deg)')
  if (flipY) transformStyles.push('rotateY(180deg)')
  const transform = transformStyles.join(' ')

  return {
    src: src || undefined,
    alt: alt || undefined,
    style: {
      width: isNumber(width) ? `${width}px` : width,
      height: isNumber(height) ? `${height}px` : height,
      transform: transform || 'none',
    },
  }
})

const imageMaxStyle = computed(() => ({
  width: unref(imgAttrs).style.width === '100%' ? '100%' : undefined,
}))

const imageRef = ref<HTMLElement | null>(null)

const resizeObserver = new ResizeObserver(entries => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect
    originalSize.value = { width, height }
    props.updateAttributes({ originWidth: width, originHeight: height })
  }
})

function selectImage() {
  const { editor, getPos } = props
  editor.commands.setNodeSelection(getPos())
}

const getMaxSize = throttle(() => {
  const { editor } = props
  maxSize.value.width = parseInt(getComputedStyle(editor.view.dom).width, 10)
}, IMAGE_THROTTLE_WAIT_TIME)

function onMouseDown(e: MouseEvent, dir: string) {
  e.preventDefault()
  e.stopPropagation()

  const { width: originalWidth, height: originalHeight } = unref(originalSize)
  const aspectRatio = originalWidth / originalHeight

  let width = Number(props.node.attrs.width) || originalWidth
  let height = Number(props.node.attrs.height) || Math.round(width / aspectRatio)
  const maxWidth = unref(maxSize).width

  width = Math.min(width > maxWidth ? maxWidth : width, maxWidth)
  height = Math.round(width / aspectRatio)

  Object.assign(resizerState.value, { x: e.clientX, y: e.clientY, w: width, h: height, dir })
  resizing.value = true

  onEvents()
}

const onMouseMove = throttle((e: MouseEvent) => {
  if (!unref(resizing)) return

  const { x, y, w, dir } = unref(resizerState)
  const dx = (e.clientX - x) * (/l/.test(dir) ? -1 : 1)
  const width = clamp(w + dx, IMAGE_MIN_SIZE, unref(maxSize).width)

  props.updateAttributes({ width })
}, IMAGE_THROTTLE_WAIT_TIME)

function onMouseUp(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (!unref(resizing)) return

  resizing.value = false
  Object.assign(resizerState.value, { x: 0, y: 0, w: 0, h: 0, dir: '' })

  offEvents()
  selectImage()
}

function onEvents() {
  document.addEventListener('mousemove', onMouseMove, true)
  document.addEventListener('mouseup', onMouseUp, true)
}

function offEvents() {
  document.removeEventListener('mousemove', onMouseMove, true)
  document.removeEventListener('mouseup', onMouseUp, true)
}

const resizeObserverDom = new ResizeObserver(getMaxSize)

const blockAlignStyle = computed(() => {
  const { textAlign } = props.node.attrs
  return (
    {
      left: 'margin-right: auto;',
      right: 'margin-left: auto;',
      center: 'margin-left: auto; margin-right: auto;',
    }[textAlign] || ''
  )
})
onMounted(() => {
  if (imageRef.value) resizeObserver.observe(imageRef.value)
  resizeObserverDom.observe(props.editor.view.dom)
})

onBeforeUnmount(() => {
  offEvents()
  resizeObserver.disconnect()
  resizeObserverDom.disconnect()
})
</script>

<template>
  <NodeViewWrapper class="node-image">
    <div class="image-view" :style="[imgAttrs.style, blockAlignStyle]">
      <div
        draggable="true"
        data-drag-handle
        :class="{
          'image-view__body--focused': selected,
          'image-view__body--resizing': resizing,
        }"
        class="image-view__body"
        :style="imageMaxStyle"
      >
        <img
          :src="imgAttrs.src"
          :alt="imgAttrs.alt"
          ref="imageRef"
          class="image-view__body__image block"
          @click="selectImage"
        />
        <div v-if="editor.view.editable" v-show="selected || resizing" class="image-resizer">
          <span
            v-for="direction in Object.values(ResizeDirection)"
            :key="direction"
            :class="`image-resizer__handler--${direction}`"
            class="image-resizer__handler"
            @mousedown="onMouseDown($event, direction)"
          ></span>
        </div>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<style scoped>
.image-view {
  max-width: 100%;
}

.image-view__body {
  position: relative;
  display: inline-block;
  max-width: 100%;
  outline: transparent solid 2px;
  transition: all 0.2s ease-in;
}

.image-view__body--focused {
  @apply outline-primary;
}

.image-view__body__image {
  margin: 0;
  cursor: pointer !important;
}

.image-resizer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  @apply border border-border;
}

.image-resizer__handler {
  position: absolute;
  z-index: 2;
  box-sizing: border-box;
  display: block;
  width: 12px;
  height: 12px;
  border: 1px solid #fff;
  border-radius: 2px;
  @apply bg-primary;
}

.image-resizer__handler--tl {
  top: -6px;
  left: -6px;
  cursor: nw-resize;
}

.image-resizer__handler--tr {
  top: -6px;
  right: -6px;
  cursor: ne-resize;
}

.image-resizer__handler--bl {
  bottom: -6px;
  left: -6px;
  cursor: sw-resize;
}

.image-resizer__handler--br {
  right: -6px;
  bottom: -6px;
  cursor: se-resize;
}
</style>
