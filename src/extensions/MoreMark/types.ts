import type { ButtonViewReturnComponentProps } from '@/type'
import type { StyleValue } from 'vue'
import { icons } from '@/components/icons'


export interface Item {
  title: string
  icon?: keyof typeof icons
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: StyleValue
  shortcutKeys?: string[]
  disabled?: boolean
  divider?: boolean
  default?: boolean
}
