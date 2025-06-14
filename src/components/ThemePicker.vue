<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import type { Theme, BorderRadius } from '@/constants'
import { THEMES, BORDER_RADIUS } from '@/constants'
import { Icon } from '@/components/icons'
import { useTheme } from '@/hooks/useTheme'

interface Props {
  modelValue?: Theme
  borderRadius?: BorderRadius
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  borderRadius: undefined,
  disabled: false,
})

interface Emits {
  (event: 'update:modelValue', color: Theme): void
  (event: 'change', color: Theme): void
  (event: 'update:borderRadius', radius: BorderRadius): void
  (event: 'borderRadiusChange', radius: BorderRadius): void
}

const emit = defineEmits<Emits>()

const { isDark } = useTheme()

function setTheme(color: Theme) {
  emit('update:modelValue', color)
  emit('change', color)
}

function setBorderRadius(radius: BorderRadius) {
  emit('update:borderRadius', radius)
  emit('borderRadiusChange', radius)
}

function reset() {
  setTheme('zinc')
  setBorderRadius(0.5)
}
</script>

<template>
  <Popover>
    <PopoverTrigger :disabled="disabled">
      <slot>
        <Button variant="ghost" size="icon" class="w-8 h-8" :disabled="disabled">
          <Icon name="Paintbrush" class="w-4 h-4" />
        </Button>
      </slot>
    </PopoverTrigger>
    <PopoverContent :side-offset="8" align="end" class="w-96">
      <div class="flex flex-col space-y-4 md:space-y-6">
        <div class="flex items-start pt-4 md:pt-0">
          <div class="space-y-1 pr-2">
            <div class="font-semibold leading-none tracking-tight">Theme Customizer</div>
            <div class="text-xs text-muted-foreground">Customize your components colors.</div>
          </div>
          <Button variant="ghost" @click="reset" size="icon" class="ml-auto rounded-[0.5rem]">
            <Icon name="Refresh" />
            <span class="sr-only">重置</span>
          </Button>
        </div>
        <div class="flex flex-1 flex-col space-y-4 md:space-y-6">
          <div class="space-y-1.5">
            <div class="text-xs font-medium">Color</div>
            <div class="grid grid-cols-3 gap-2">
              <Button
                v-for="(color, index) in THEMES"
                :key="index"
                variant="outline"
                class="h-8 justify-start px-3"
                :class="color.name === modelValue ? 'border-foreground border-2' : ''"
                :style="{
                  '--theme-primary': `hsl(${color?.activeColor[isDark ? 'dark' : 'light']})`,
                }"
                @click="setTheme(color.name)"
              >
                <span class="h-5 w-5 rounded-full flex items-center justify-center shrink-0 bg-[--theme-primary]">
                  <Icon name="Check" v-if="color.name === modelValue" class="h-3 w-3 text-white" />
                </span>
                <span class="ml-2 text-xs capitalize">
                  {{ color.name }}
                </span>
              </Button>
            </div>
          </div>
          <div class="space-y-1.5">
            <div class="text-xs font-medium">Radius</div>
            <div class="grid grid-cols-5 gap-2">
              <Button
                v-for="(radius, index) in BORDER_RADIUS"
                :key="index"
                variant="outline"
                class="h-8 justify-start px-3"
                :class="radius === borderRadius ? 'border-foreground border-2' : ''"
                @click="setBorderRadius(radius as BorderRadius)"
              >
                <span class="text-xs">
                  {{ radius }}
                </span>
              </Button>
            </div>
          </div>
          <div class="space-y-1.5">
            <div class="text-xs font-medium">Theme</div>
            <div class="flex space-x-2">
              <Button
                class="h-8"
                variant="outline"
                :class="{ 'border-2 border-foreground': !isDark }"
                @click="isDark = false"
              >
                <Icon name="Sun" class="w-4 h-4 mr-2" />
                <span class="text-xs">Light</span>
              </Button>
              <Button
                class="h-8"
                variant="outline"
                :class="{ 'border-2 border-foreground': isDark }"
                @click="isDark = true"
              >
                <Icon name="Moon" class="w-4 h-4 mr-2" />
                <span class="text-xs">Dark</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
