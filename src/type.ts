import type { Editor as CoreEditor, Extension, JSONContent, AnyExtension } from '@tiptap/core'
import type { Editor } from '@tiptap/vue-3'
import { icons } from '@/components/icons'
export type { Editor, JSONContent } from '@tiptap/core'

/**
 * Represents the onChange event for EchoEditor.
 */
export type EchoEditorOnChange = {
  /** Editor object */
  editor: CoreEditor
  /** Output content, can be a string or JSON content */
  output: string | JSONContent
}

/**
 * Represents the keys for different extensions.
 */
export type ExtensionNameKeys =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'color'
  | 'highlight'
  | 'heading'
  | 'textAlign'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'indent'
  | 'link'
  | 'image'
  | 'video'
  | 'table'
  | 'blockquote'
  | 'horizontalRule'
  | 'code'
  | 'codeBlock'
  | 'clear'
  | 'history'
  | 'fullscreen'

/**
 * Represents the general options for Tiptap extensions.
 */
export interface GeneralOptions<T> {
  /** Enabled divider */
  divider?: boolean
  /** Enabled spacer */
  spacer?: boolean
  /** Button view function */
  button: ButtonView<T>
  /** Show on Toolbar */
  toolbar?: boolean
}

/**
 * Represents the props for the ButtonView component.
 */
export interface ButtonViewReturnComponentProps {
  /** Method triggered when action is performed */
  action?: (value?: any) => void
  /** Whether it is in the active state */
  isActive?: () => boolean
  /** Button icon */
  icon?: keyof typeof icons
  /** Text displayed on hover */
  tooltip?: string
  [x: string]: any
}

/**
 * Represents the slots for the ButtonView component.
 */
export interface ButtonViewReturnComponentSlots {
  /** Dialog slot */
  dialog: () => any
  [x: string]: () => any
}

/**
 * Represents the return value for the ButtonView component.
 */
export interface ButtonViewReturn {
  /** Component */
  component: unknown
  /** Component props */
  componentProps: ButtonViewReturnComponentProps
  /** Component slots */
  componentSlots?: ButtonViewReturnComponentSlots
}

/**
 * Represents the parameters for the ButtonView function.
 */
export interface ButtonViewParams<T = any> {
  /** Editor object */
  editor: Editor
  /** Extension object */
  extension: Extension<T>
  /** Translation function */
  t: (path: string) => string
}

/**
 * Represents the ButtonView function.
 */
export interface ButtonView<T = any> {
  (options: ButtonViewParams<T>): ButtonViewReturn | ButtonViewReturn[]
}

export interface EchoEditorProps {
  /**
   * Input value
   * Can be HTML string or JSON content
   */
  modelValue?: string | JSONContent

  /**
   * Editor output type
   * - html: outputs HTML string
   * - json: outputs JSON object
   * - text: outputs plain text
   * @default 'html'
   */
  output?: 'html' | 'json' | 'text'

  /**
   * Dark mode
   * @default undefined - follows system
   */
  dark?: boolean

  /**
   * Make editor readonly
   * @default false
   */
  disabled?: boolean

  /**
   * Hide Editor Toolbar
   * @default false
   */
  hideToolbar?: boolean

  /**
   * Hide Editor Menubar
   * @default false
   */
  hideMenubar?: boolean

  /**
   * Hide Editor Bubble Menu
   * @default false
   */
  hideBubble?: boolean

  /**
   * Remove tiptap default wrapper when editor is empty eg. <p></p>
   * @default false
   */
  removeDefaultWrapper?: boolean

  /**
   * Editor content maximum width
   * Can be number (px) or CSS unit string
   */
  maxWidth?: string | number

  /**
   * Editor content minimum height
   * Can be number (px) or CSS unit string
   */
  minHeight?: string | number

  /**
   * Editor content maximum height
   * Can be number (px) or CSS unit string
   */
  maxHeight?: string | number

  /**
   * Tiptap extensions
   * Used to extend editor functionality
   */
  extensions?: AnyExtension[]

  /**
   * Editor container class
   * Accepts string, array or object
   */
  editorClass?: string | string[] | Record<string, any>

  /**
   * Editor content class
   * Accepts string, array or object
   */
  contentClass?: string | string[] | Record<string, any>
}

export interface EchoEditorEmits {
  (event: 'enter'): void
  (event: 'change', value: EchoEditorOnChange): void
  (event: 'update:modelValue', value: string | JSONContent): void
}
