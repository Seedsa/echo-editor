import { ref, watch, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useDark } from '@vueuse/core'
import { Theme, BORDER_RADIUS } from '@/constants/index'
import { THEMES, DEFAULT_THEME, BorderRadius, DEFAULT_BORDER_RADIUS } from '@/constants/index'

export function useTheme() {
  // 使用本地存储持久化主题设置
  const storedTheme = useLocalStorage<Theme>('echo-editor-theme-color', DEFAULT_THEME)
  const storedBorderRadius = useLocalStorage<BorderRadius>('echo-editor-border-radius', DEFAULT_BORDER_RADIUS)

  // 创建响应式的主题状态，与本地存储同步
  const theme = ref<Theme>(storedTheme.value)
  const borderRadius = ref<BorderRadius>(storedBorderRadius.value)

  // 配置 useDark 以支持系统主题跟随
  const isDark = useDark()

  // 检测系统主题
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')

  // 获取当前主题色配置
  const currentTheme = computed(() => {
    return THEMES.find(color => color.name === theme.value) || THEMES[0]
  })

  // 获取当前圆角配置
  const currentBorderRadius = computed(() => {
    return BORDER_RADIUS.find(radius => radius === borderRadius.value) || DEFAULT_BORDER_RADIUS
  })

  // 应用主题色
  const applyTheme = () => {
    const colorConfig = currentTheme.value
    const isDarkMode = isDark.value

    const root = document.documentElement
    const colorScheme = isDarkMode ? colorConfig.cssVars.dark : colorConfig.cssVars.light

    // 创建或获取主题样式元素
    let themeStyleElement = document.getElementById('echo-editor-theme-styles')
    if (!themeStyleElement) {
      themeStyleElement = document.createElement('style')
      themeStyleElement.id = 'echo-editor-theme-styles'
      document.head.appendChild(themeStyleElement)
    }

    // 生成CSS规则，只对echo-editor相关的元素生效
    const cssRules = Object.entries(colorScheme)
      .map(([key, value]) => `.echo-editor, .echo-editor * { --${key}: ${value}; }`)
      .join('\n')

    // 应用主题样式
    themeStyleElement.textContent = cssRules

    // 添加主题色类名到根元素
    root.classList.remove(...THEMES.map(c => `theme-${c.name}`))
    root.classList.add(`theme-${theme.value}`)
  }

  // 应用圆角
  const applyBorderRadius = () => {
    const radiusConfig = currentBorderRadius.value
    const root = document.documentElement

    // 应用圆角到CSS变量
    root.style.setProperty('--radius', `${radiusConfig}rem`)
  }

  // 监听系统主题变化
  systemTheme.addEventListener('change', (e) => {
    // 如果当前没有手动设置主题，则跟随系统主题
    if (!localStorage.getItem('echo-editor-dark-mode')) {
      isDark.value = e.matches
    }
  })

  // 监听本地存储变化，同步到本地状态
  watch(storedTheme, (newColor) => {
    theme.value = newColor
  })

  watch(storedBorderRadius, (newRadius) => {
    borderRadius.value = newRadius
  })

  // 监听主题色变化，同步到本地存储
  watch(theme, (newColor) => {
    storedTheme.value = newColor
    applyTheme()
  })

  // 监听圆角变化，同步到本地存储
  watch(borderRadius, (newRadius) => {
    storedBorderRadius.value = newRadius
    applyBorderRadius()
  })

  // 监听暗色模式变化
  watch(isDark, () => {
    applyTheme()
  })

  // 初始化
  applyTheme()
  applyBorderRadius()

  return {
    theme,
    borderRadius,
    isDark,
    themes: THEMES,
    borderRadiusOptions: BORDER_RADIUS,
    currentTheme,
    currentBorderRadius,
    toggleTheme: () => {
      isDark.value = !isDark.value
    },
    setTheme: (color: Theme) => {
      theme.value = color
    },
    setBorderRadius: (radius: BorderRadius) => {
      borderRadius.value = radius
    },
  }
}
