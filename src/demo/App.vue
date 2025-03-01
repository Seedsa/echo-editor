<template>
  <div class="min-h-screen bg-background">
    <header
      class="border-grid w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div class="container flex h-14 items-center">
        <div class="mr-4 md:mr-1 hidden md:flex">
          <a href="/" class="mr-4 md:mr-2 lg:mr-6 flex items-center lg:space-x1 xl:space-x-2">
            <span class="font-bold">Echo Editor Demo</span>
          </a>
        </div>
      </div>
    </header>
    <main class="container py-6">
      <EchoEditor :extensions="extensions" v-model="content" :maxHeight="1024" output="html" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Bold,
  BulletList,
  Italic,
  BaseKit,
  Underline,
  Strike,
  LineHeight,
  Image,
  History,
  Heading,
  CodeBlock,
  FontSize,
  Highlight,
  Table,
  Clear,
  Blockquote,
  Link,
  Color,
  Video,
  OrderedList,
  HorizontalRule,
  Fullscreen,
  TaskList,
  MoreMark,
  FormatPainter,
  SlashCommand,
  Indent,
  ImportWord,
  Columns,
  TextAlign,
  ImageUpload,
  VideoUpload,
  FontFamily,
  FindAndReplace,
  Code,
  AI,
  Preview,
  EchoEditor,
  Printer,
} from '../index'
import { DEMO_CONTENT } from './content'

const content = ref(DEMO_CONTENT)

const extensions = [
  BaseKit.configure({
    characterCount: {
      limit: 50000,
    },
  }),
  History,
  Columns,
  FormatPainter,
  Clear,
  Heading.configure({ spacer: true }),
  FontSize,
  FontFamily,
  Bold,
  Italic,
  Underline,
  Strike,
  MoreMark,
  Color.configure({ spacer: true }),
  Highlight,
  BulletList,
  OrderedList,
  TextAlign.configure({ types: ['heading', 'paragraph', 'image'], spacer: true }),
  Indent,
  LineHeight,
  TaskList.configure({
    spacer: true,
    taskItem: {
      nested: true,
    },
  }),
  Link,
  Image,
  ImageUpload.configure({
    upload: (files: File) => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files))
        }, 3000)
      })
    },
  }),
  Video,
  VideoUpload.configure({
    // upload: handleFileUpload,
  }),
  Blockquote,
  SlashCommand,
  HorizontalRule,
  Fullscreen.configure({ spacer: true }),
  // CodeBlock.configure({ lowlight: createLowlight(common) }),
  Table,
  Code,
  // ExportWord,
  AI.configure({
    // completions: AICompletions,
    shortcuts: [
      // 这里可以传入额外的自定义shortcuts
      {
        label: 'Custom Actions',
        children: [
          {
            label: 'This is Custom Action',
            prompt:
              'Rewrite this content with no spelling mistakes, proper grammar, and with more descriptive language, using best writing practices without losing the original meaning.',
          },
        ],
      },
    ],
  }),
  ImportWord.configure({
    // upload: handleFileUpload,
  }),
  FindAndReplace.configure({ spacer: true }),
  Printer,
  Preview,
]
</script>
