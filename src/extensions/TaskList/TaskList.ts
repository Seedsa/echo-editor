import {
  TaskItemOptions,
  TaskItem,
  TaskListOptions as TiptapTaskListOptions,
  TaskList as TiptapTaskList,
} from "@tiptap/extension-list";

import ActionButton from '@/components/ActionButton.vue'

import type { GeneralOptions } from '@/type'

/**
 * Represents the interface for task list options, extending TiptapTaskListOptions and GeneralOptions.
 */
export interface TaskListOptions extends TiptapTaskListOptions, GeneralOptions<TaskListOptions> {
  /** options for task items */
  taskItem: Partial<TaskItemOptions>
}

export const TaskList = TiptapTaskList.extend<TaskListOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'task-list',
      },
      taskItem: {
        HTMLAttributes: {
          class: 'task-list-item',
        },
      },
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => editor.chain().toggleTaskList().focus().run(),
          isActive: () => editor.isActive('taskList') || false,
          disabled: !editor.isEditable || !editor.can().toggleTaskList(),
          icon: 'ListTodo',
          shortcutKeys: ['shift', 'mod', '9'],
          tooltip: t('editor.tasklist.tooltip'),
        },
      }),
    }
  },

  addExtensions() {
    return [TaskItem.configure(this.options.taskItem)]
  },
})
