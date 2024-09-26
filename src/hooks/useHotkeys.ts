import hotkeys from 'hotkeys-js'
import { onBeforeUnmount } from 'vue'

export const useHotkeys = (keys: string, callback: CallableFunction) => {
  hotkeys.filter = () => true

  // 绑定快捷键
  const bind = () => {
    hotkeys(keys, (e: Event) => {
      e.preventDefault()
      callback()
      return false
    })
  }

  // 解绑快捷键
  const unbind = () => {
    hotkeys.unbind(keys)
  }

  // 在组件卸载时自动解绑
  onBeforeUnmount(() => {
    unbind()
  })

  // 返回用于手动控制的绑定和解绑函数
  return { bind, unbind }
}
