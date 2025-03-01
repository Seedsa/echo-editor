import { ref, onUnmounted } from 'vue'
import { Editor } from '@tiptap/core'
import debounce from 'lodash/debounce'

export interface UseEditorFocusOptions {
  editor: Editor | null
  /**
   * 更新聚焦状态的防抖等待时间（毫秒）
   * @default 250
   */
  wait?: number
}

/**
 * 处理编辑器聚焦状态的 Hook
 * 用于防止在操作工具栏等界面元素时出现边框闪烁的问题
 */
export function useEditorFocus({ editor, wait = 250 }: UseEditorFocusOptions) {
  const isFocused = ref(!!editor?.isFocused)

  const updateFocusState = debounce((focused: boolean) => {
    isFocused.value = focused
  }, wait)

  if (editor) {
    editor.on('focus', () => {
      isFocused.value = true
      updateFocusState.cancel()
    })

    editor.on('blur', () => {
      updateFocusState(false)
    })
  }

  onUnmounted(() => {
    updateFocusState.cancel()
  })

  return {
    isFocused
  }
}
