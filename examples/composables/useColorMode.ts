import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export function useColorMode() {
  const theme = ref<Theme>('system')

  // 检测系统主题
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')

  // 更新实际主题
  const updateTheme = () => {
    const isDark = theme.value === 'dark' ||
      (theme.value === 'system' && systemTheme.matches)

    document.documentElement.classList.toggle('dark', isDark)
  }

  // 监听系统主题变化
  systemTheme.addEventListener('change', () => {
    if (theme.value === 'system') {
      updateTheme()
    }
  })

  // 监听主题变化
  watch(theme, () => {
    updateTheme()
  })

  return {
    theme,
    toggleTheme: () => {
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
    }
  }
}
