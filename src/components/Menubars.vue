<script setup lang="ts">
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { useLocale } from '@/locales'
import type { Editor } from '@tiptap/core'
import { Icon, icons } from '@/components/icons'
import { getShortcutKeys } from '@/utils/plateform'
import { getSelectionText } from '@/utils/content'
import { useTiptapStore } from '@/hooks'
const DRAFT_KEY = 'echo-editor-draft' // 本地存储的 key

interface Props {
  editor: Editor
  disabled?: boolean
}
interface MenuItem {
  title?: string
  action?: () => void
  icon?: keyof typeof icons
  disabled?: boolean | (() => boolean)
  checked?: boolean | (() => boolean)
  shortcut?: string[]
  separator?: boolean
  requiredExtensions?: string[]
}

interface MenuGroup {
  title: string
  children: MenuItem[]
}
const { t } = useLocale()

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})
const store = useTiptapStore()

// 获取当前编辑器加载的扩展名
const activeExtensions = computed(() => props.editor.extensionManager.extensions.map(ext => ext.name))
// 检查菜单项的扩展是否已经加载
const isExtensionLoaded = (requiredExtensions?: string[]) => {
  if (!requiredExtensions) return true
  return requiredExtensions.every(ext => activeExtensions.value.includes(ext))
}

const loadedMenuItems = computed(() => {
  return menubarMenus.value
    .map(group => {
      // 首先过滤出有效的子项
      const filteredChildren = group.children.filter(item => isExtensionLoaded(item.requiredExtensions))

      // 处理分隔符：移除开头的分隔符、结尾的分隔符，以及连续的分隔符
      const cleanedChildren = filteredChildren.reduce((acc: MenuItem[], curr, index) => {
        // 跳过开头的分隔符
        if (index === 0 && curr.separator) {
          return acc
        }

        // 跳过结尾的分隔符
        if (index === filteredChildren.length - 1 && curr.separator) {
          return acc
        }

        // 跳过连续的分隔符
        if (curr.separator && acc[acc.length - 1]?.separator) {
          return acc
        }

        // 如果当前是分隔符，确保后面还有非分隔符的项目
        if (curr.separator) {
          const hasNextItem = filteredChildren.slice(index + 1).some(item => !item.separator)
          if (!hasNextItem) {
            return acc
          }
        }

        acc.push(curr)
        return acc
      }, [])

      return {
        ...group,
        children: cleanedChildren,
      }
    })
    .filter(group => group.children.length > 0) // 过滤掉没有子项的菜单组
})
const saveDraft = () => {
  const content = props.editor.getHTML()
  if (content && !props.editor.isEmpty) {
    localStorage.setItem(DRAFT_KEY, content)
  }
}

const restoreDraft = () => {
  const content = localStorage.getItem(DRAFT_KEY)
  if (content) {
    props.editor?.chain().setContent(content, true).focus().run()
  }
}
const clearEditor = () => {
  props.editor.chain().clearContent(true).focus().run()
}
const hasDraft = () => {
  return !!localStorage.getItem(DRAFT_KEY)
}
const clearDraft = () => {
  localStorage.removeItem(DRAFT_KEY)
}

const menubarMenus = ref<MenuGroup[]>([
  {
    title: 'editor.menubar.file',
    children: [
      {
        title: 'editor.menubar.menu.newDoc',
        icon: 'File',
        disabled: () => !props.editor.isEditable,
        action: () => {
          saveDraft()
          clearEditor()
        },
      },
      {
        title: 'editor.menubar.menu.restoreLastDraft',
        icon: 'Refresh',
        disabled: () => !hasDraft() || !props.editor.isEditable,
        action: () => {
          restoreDraft() // 恢复保存的草稿
          clearDraft()
        },
      },
      {
        separator: true,
      },
      {
        title: 'editor.menubar.menu.preview',
        icon: 'Eye',
        action: () => {
          props.editor?.chain().togglePreview().focus().run()
        },
        requiredExtensions: ['preview'],
      },
      {
        separator: true,
      },
      {
        title: 'editor.importWord.tooltip',
        icon: 'Word',
        disabled: () => !props.editor.isEditable,
        action: () => {
          props.editor.chain().toggleImportWord().focus().run()
        },
        requiredExtensions: ['importWord'],
      },
      {
        separator: true,
      },
      {
        title: 'editor.menubar.menu.print',
        icon: 'Printer',
        shortcut: ['mod', 'P'],
        requiredExtensions: ['printer'],
        action: () => {
          // 实现打印
          store.state.printer = true
        },
      },
    ],
  },
  {
    title: 'editor.menubar.edit',
    children: [
      {
        title: 'editor.undo.tooltip',
        icon: 'Undo2',
        shortcut: ['mod', 'Z'],
        disabled: () => !props.editor.can().undo() || !props.editor.isEditable,
        action: () => {
          props.editor.chain().undo().focus().run()
        },
        requiredExtensions: ['history'],
      },
      {
        title: 'editor.redo.tooltip',
        icon: 'Redo2',
        shortcut: ['shift', 'mod', 'Z'],
        disabled: () => !props.editor.can().redo() || !props.editor.isEditable,
        action: () => {
          props.editor.chain().redo().focus().run()
        },
        requiredExtensions: ['history'],
      },
      {
        separator: true,
      },
      {
        title: 'editor.menubar.menu.cut',
        icon: 'Cut',
        shortcut: ['mod', 'X'],
        disabled: () => !props.editor.isEditable,
        action: async () => {
          const text = getSelectionText(props.editor)
          if (text) {
            await navigator.clipboard.writeText(text) // 将文本写入剪贴板
            props.editor.chain().deleteSelection().focus().run()
          }
        },
      },
      {
        title: 'editor.menubar.menu.copy',
        icon: 'Copy',
        shortcut: ['mod', 'C'],
        action: async () => {
          const text = getSelectionText(props.editor)
          if (text) {
            document.execCommand('copy')
          }
        },
      },
      {
        title: 'editor.menubar.menu.paste',
        icon: 'Paste',
        shortcut: ['mod', 'V'],
        disabled: () => !props.editor.isEditable,
        action: async () => {
          try {
            const clipboardItems = await navigator.clipboard.read()
            let htmlContent = ''
            let textContent = ''
            for (const item of clipboardItems) {
              // 检查是否有 HTML 格式的内容
              if (item.types.includes('text/html')) {
                const blob = await item.getType('text/html')
                htmlContent = await blob.text()
              }
              // 检查是否有纯文本内容
              if (item.types.includes('text/plain')) {
                const blob = await item.getType('text/plain')
                textContent = await blob.text()
              }
            }
            // 如果有 HTML 内容，插入 HTML，否则插入纯文本
            if (htmlContent) {
              props.editor.chain().insertContent(htmlContent).focus().run()
            } else if (textContent) {
              props.editor.chain().insertContent(textContent).focus().run()
            }
          } catch (err) {
            console.error('读取剪贴板内容时出错: ', err)
          }
        },
      },
      {
        title: 'editor.menubar.menu.pasteAsText',
        icon: 'Paste',
        disabled: () => !props.editor.isEditable,
        action: async () => {
          const text = await navigator.clipboard.readText()
          if (text) {
            props.editor.chain().insertContent(text).focus().run()
          }
        },
      },
      {
        separator: true,
      },
      {
        title: 'editor.menubar.menu.selectAll',
        disabled: () => !props.editor.isEditable,
        icon: 'TextSelect',
        action: () => {
          props.editor?.chain().focus().selectAll().run()
        },
      },
      {
        separator: true,
      },
      {
        title: 'editor.findAndReplace.tooltip',
        icon: 'DocSearch',
        action: () => {
          store.toggleFindAndReplace()
        },
        requiredExtensions: ['findAndReplace'],
      },
    ],
  },
  {
    title: 'editor.menubar.view',
    children: [
      {
        title: 'editor.fullscreen.tooltip.fullscreen',
        icon: 'Maximize',
        action: () => {
          props.editor?.chain().setFullscreen().focus().run()
        },
        requiredExtensions: ['fullscreen'],
      },
      {
        title: 'editor.menubar.menu.preview',
        action: () => {
          props.editor.chain().togglePreview().focus().run()
        },
        icon: 'Eye',
        requiredExtensions: ['preview'],
      },
      {
        separator: true,
      },
      {
        title: 'editor.menubar.menu.spellCheck',
        icon: 'SpellCheck',
        checked: () => {
          return store.state.spellCheck
        },
        action: () => {
          store.toggleSpellCheck()
        },
      },
    ],
  },
  {
    title: 'editor.menubar.insert',
    children: [
      {
        title: 'editor.image.tooltip',
        icon: 'ImageUp',
        disabled: () => !props.editor.isEditable || !props.editor.can().setImage({}),
        action: () => {
          props.editor.chain()?.setImageUpload().run()
        },
        requiredExtensions: ['image', 'imageUpload'],
      },
      {
        title: 'editor.video.tooltip',
        icon: 'Video',
        disabled: () => !props.editor.isEditable || !props.editor.can().setVideo({}),
        action: () => {
          props.editor.chain()?.setVideoUpload().run()
        },
        requiredExtensions: ['video', 'videoUpload'],
      },
      {
        title: 'editor.link.tooltip',
        icon: 'Link',
        disabled: () => !props.editor.isEditable || !props.editor.can().setLink({ href: '' }),
        action: () => {
          props.editor
            .chain()
            .extendMarkRange('link')
            .insertContent({
              type: 'text',
              text: 'link',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: '',
                    target: '_blank',
                  },
                },
              ],
            })
            .setLink({ href: '' })
            .focus()
            .run()
        },
        requiredExtensions: ['link'],
      },
    ],
  },
  {
    title: 'editor.menubar.format',
    children: [
      {
        title: 'editor.bold.tooltip',
        icon: 'Bold',
        shortcut: ['Mod', 'B'],
        disabled: () => !props.editor.isEditable || !props.editor.can().toggleBold(),
        action: () => {
          props.editor.chain().toggleBold().focus().run()
        },
        requiredExtensions: ['bold'],
      },
      {
        title: 'editor.italic.tooltip',
        icon: 'Italic',
        shortcut: ['Mod', 'I'],
        disabled: () => !props.editor.isEditable || !props.editor.can().toggleItalic(),
        action: () => {
          props.editor.chain().toggleItalic().focus().run()
        },
        requiredExtensions: ['italic'],
      },
      {
        title: 'editor.underline.tooltip',
        icon: 'Underline',
        shortcut: ['Mod', 'U'],
        disabled: () => !props.editor.isEditable || !props.editor.can().toggleUnderline(),
        action: () => {
          props.editor.chain().toggleUnderline().focus().run()
        },
        requiredExtensions: ['underline'],
      },
      {
        title: 'editor.strike.tooltip',
        icon: 'Strikethrough',
        disabled: () => !props.editor.isEditable || !props.editor.can().toggleStrike(),
        action: () => {
          props.editor.chain().toggleStrike().focus().run()
        },
        requiredExtensions: ['strike'],
      },
      {
        title: 'editor.superscript.tooltip',
        icon: 'Superscript',
        disabled: () => !props.editor.isEditable || !props.editor.can().toggleSuperscript(),
        action: () => {
          props.editor.chain().toggleSuperscript().focus().run()
        },
        requiredExtensions: ['superscript'],
      },
      {
        title: 'editor.subscript.tooltip',
        icon: 'Subscript',
        disabled: () => !props.editor.isEditable || !props.editor.can().toggleSubscript(),
        action: () => {
          props.editor.chain().toggleSubscript().focus().run()
        },
        requiredExtensions: ['subscript'],
      },
      {
        title: 'editor.code.tooltip',
        icon: 'Code',
        disabled: () => !props.editor.isEditable || !props.editor.can().toggleCode(),
        action: () => {
          props.editor.chain().toggleCode().focus().run()
        },
        requiredExtensions: ['code'],
      },
    ],
  },
])
const handleClick = (clickHandler: (() => void) | undefined) => {
  if (clickHandler) {
    clickHandler()
  }
}
const isDisabled = (disabled?: boolean | (() => boolean)) => {
  if (disabled === undefined) {
    return false // 默认情况下，undefined 表示不禁用
  }
  return typeof disabled === 'function' ? disabled() : disabled
}
const isChecked = (checked?: boolean | (() => boolean)) => {
  if (checked === undefined) {
    return false
  }
  return typeof checked === 'function' ? checked() : checked
}
</script>

<template>
  <Menubar
    class="rounded-b-none shadow-none border-t-transparent border-l-transparent border-r-transparent rounded-t-[0.5rem]"
  >
    <MenubarMenu v-for="(item, index) in loadedMenuItems" :key="index">
      <MenubarTrigger>{{ t(item.title) }}</MenubarTrigger>
      <MenubarContent>
        <template v-for="(sub, subIndex) in item.children" :key="subIndex">
          <MenubarSeparator v-if="sub?.separator" />
          <MenubarCheckboxItem
            v-else-if="sub.checked && isExtensionLoaded(sub.requiredExtensions)"
            @click="handleClick(sub.action)"
            :model-value="isChecked(sub.checked)"
            :disabled="isDisabled(sub.disabled)"
            class="flex gap-3"
          >
            <Icon v-if="sub.icon" :name="sub.icon" />
            {{ t(sub.title!) }}
            <MenubarShortcut v-if="sub.shortcut">{{ getShortcutKeys(sub.shortcut) }}</MenubarShortcut>
          </MenubarCheckboxItem>
          <MenubarItem
            v-else-if="isExtensionLoaded(sub.requiredExtensions)"
            @click="handleClick(sub.action)"
            :disabled="isDisabled(sub.disabled)"
            class="flex gap-3"
          >
            <Icon v-if="sub.icon" :name="sub.icon" />
            {{ t(sub.title!) }}
            <MenubarShortcut v-if="sub.shortcut">{{ getShortcutKeys(sub.shortcut) }}</MenubarShortcut>
          </MenubarItem>
        </template>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>
