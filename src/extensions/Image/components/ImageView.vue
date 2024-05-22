<script setup lang="ts">
import { computed, ref, unref, watchEffect } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { ImageAttrsOptions } from '../types'

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
const maxSize = ref<Size>({
  width: IMAGE_MAX_SIZE,
  height: IMAGE_MAX_SIZE,
})

const originalSize = ref({
  width: 0,
  height: 0,
})

const resizeDirections = ref<string[]>([
  ResizeDirection.TOP_LEFT,
  ResizeDirection.TOP_RIGHT,
  ResizeDirection.BOTTOM_LEFT,
  ResizeDirection.BOTTOM_RIGHT,
])

const resizing = ref<boolean>(false)

const resizerState = ref({
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  dir: '',
})

const imgAttrs = computed(() => {
  const { src, alt, width: w, height: h } = props.node.attrs
  const width = isNumber(w) ? w + 'px' : w
  const height = isNumber(h) ? h + 'px' : h
  return {
    src: src || undefined,
    alt: alt || undefined,
    style: {
      width: width || undefined,
      height: height || undefined,
    },
  }
})

const display = computed<ImageAttrsOptions['display']>(() => props.node.attrs.display || undefined)
const lockAspectRatio = computed<ImageAttrsOptions['lockAspectRatio']>(() => props.node.attrs.lockAspectRatio ?? true)
const imageViewClass = computed<string[]>(() => {
  if (typeof unref(display) === 'string') {
    return ['image-view', `image-view--${unref(display)}`]
  }

  return ['image-view']
})
const imageMaxStyle = computed(() => {
  const {
    style: { width },
  } = unref(imgAttrs)

  return { width: width === '100%' ? width : undefined }
})

function onImageLoad(e: Record<string, any>) {
  originalSize.value = {
    width: e.target.width,
    height: e.target.height,
  }
}

// https://github.com/scrumpy/tiptap/issues/361#issuecomment-540299541
function selectImage() {
  const { editor, getPos } = props
  editor.commands.setNodeSelection(getPos())
}

/* 当窗口或编辑器调整大小时调用 */
const getMaxSize = throttle(function () {
  const { editor } = props
  const { width } = getComputedStyle(editor.view.dom)
  maxSize.value.width = parseInt(width, 10)
}, IMAGE_THROTTLE_WAIT_TIME)

/*
 * 记录触发事件的位置并调整方向
 * 计算图像的初始宽度和高度
 */
function onMouseDown(e: MouseEvent, dir: string) {
  e.preventDefault()
  e.stopPropagation()

  resizerState.value.x = e.clientX
  resizerState.value.y = e.clientY

  const originalWidth = unref(originalSize).width
  const originalHeight = unref(originalSize).height
  const aspectRatio = originalWidth / originalHeight

  let width = Number(props.node.attrs.width)
  let height = Number(props.node.attrs.height)
  const maxWidth = unref(maxSize).width

  if (width && !height) {
    width = width > maxWidth ? maxWidth : width
    height = Math.round(width / aspectRatio)
  } else if (height && !width) {
    width = Math.round(height * aspectRatio)
    width = width > maxWidth ? maxWidth : width
  } else if (!width && !height) {
    width = originalWidth > maxWidth ? maxWidth : originalWidth
    height = Math.round(width / aspectRatio)
  } else {
    width = width > maxWidth ? maxWidth : width
  }

  resizerState.value.w = width
  resizerState.value.h = height
  resizerState.value.dir = dir

  resizing.value = true

  onEvents()
}

const onMouseMove = throttle(function (e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (!unref(resizing)) return

  const { x, y, w, h, dir } = unref(resizerState)

  const dx = (e.clientX - x) * (/l/.test(dir) ? -1 : 1)
  const dy = (e.clientY - y) * (/t/.test(dir) ? -1 : 1)

  const width = clamp(w + dx, IMAGE_MIN_SIZE, unref(maxSize).width)
  const height = unref(lockAspectRatio) ? null : Math.max(h + dy, IMAGE_MIN_SIZE)

  props.updateAttributes({
    width,
    height,
  })
}, IMAGE_THROTTLE_WAIT_TIME)

function onMouseUp(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (!unref(resizing)) return

  resizing.value = false

  resizerState.value = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    dir: '',
  }

  offEvents()
  selectImage()
}

function onEvents() {
  document?.addEventListener('mousemove', onMouseMove, true)
  document?.addEventListener('mouseup', onMouseUp, true)
}

function offEvents() {
  document?.removeEventListener('mousemove', onMouseMove, true)
  document?.removeEventListener('mouseup', onMouseUp, true)
}

const resizeOb: ResizeObserver = new ResizeObserver(() => getMaxSize())

watchEffect(effect => {
  unref(resizeOb).observe(props.editor.view.dom)

  effect(() => {
    unref(resizeOb).disconnect()
  })
})
</script>

<template>
  <NodeViewWrapper
    as="div"
    :class="imageViewClass"
    :style="{ imageMaxStyle, textAlign: node.attrs.textAlign, width: '100%' }"
  >
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
        :style="imgAttrs.style"
        class="image-view__body__image"
        @load="onImageLoad"
        @click="selectImage"
      />
      <div v-if="editor.view.editable" v-show="selected || resizing" class="image-resizer">
        <span
          v-for="direction in resizeDirections"
          :key="direction"
          :class="`image-resizer__handler--${direction}`"
          class="image-resizer__handler"
          @mousedown="onMouseDown($event, direction)"
        ></span>
      </div>
    </div>
  </NodeViewWrapper>
</template>
