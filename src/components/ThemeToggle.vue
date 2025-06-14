<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import ThemePicker from './ThemePicker.vue'

interface Props {
  disabled?: boolean
  showTheme?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  showTheme: true,
})

const { theme, borderRadius, isDark } = useTheme()
</script>

<template>
  <div class="flex items-center gap-1">
    <!-- 主题色选择器 -->
    <ThemePicker v-if="showTheme" v-model="theme" v-model:borderRadius="borderRadius" :disabled="disabled" />

    <Button v-if="isDark" variant="ghost" size="icon" class="w-8 h-8" :disabled="disabled" @click="isDark = false">
      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" class="w-4 h-4 text-foreground">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <circle cx="12" cy="12" r="4"></circle>
          <path
            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
          ></path>
        </g>
      </svg>
    </Button>
    <Button v-else variant="ghost" size="icon" class="w-8 h-8" :disabled="disabled" @click="isDark = true">
      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" class="w-4 h-4 text-foreground">
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9"
        ></path>
      </svg>
    </Button>
  </div>
</template>
