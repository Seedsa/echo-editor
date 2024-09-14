<template>
  <div>
    <header class="p-3 flex gap-3 justify-center w-full bg-gray-100 text-foreground">
      <button ghost @click="locale.setLang('zhHans')">中文</button>
      <button ghost @click="locale.setLang('en')">English</button>
      <button ghost @click="theme = 'dark'">dark</button>
      <button ghost @click="theme = null">light</button>
      <button ghost @click="hideToolbar = !hideToolbar">{{ !hideToolbar ? 'Hide Toolbar' : 'Show Toolbar' }}</button>
      <button ghost @click="disabled = !disabled">{{ disabled ? 'Editable' : 'Readonly' }}</button>
      <a href="https://github.com/Seedsa/echo-editor" target="__blank">Github</a>
    </header>
    <div class="my-0 mx-auto max-w-[1024px] p-6">
      <echo-editor
        v-model="content"
        :extensions="extensions"
        :hideToolbar="hideToolbar"
        :disabled="disabled"
        output="html"
        :dark="theme === 'dark'"
      >
      </echo-editor>
      <div class="mt-3 text-sm text-zinc-700">
        {{ content }}
      </div>
    </div>
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
  locale,
  ImportWord,
  Columns,
  TextAlign,
  ImageUpload,
  VideoUpload,
  Code,
  AI,
} from 'echo-editor'
import { ExportWord } from './extensions/ExportWord'
import OpenAI from 'openai'
import { DEMO_CONTENT } from './initContent'
import { createLowlight, common } from 'lowlight'
const content = ref(DEMO_CONTENT)

const theme = ref<string | null>(null)
const hideToolbar = ref<boolean>(false)
const disabled = ref<boolean>(false)
const extensions = [
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true,
    },
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
  Bold,
  Italic,
  Underline,
  Strike,
  MoreMark,
  Color.configure({ spacer: true }),
  Highlight,
  BulletList,
  OrderedList,
  TextAlign.configure({ types: ['heading', 'paragraph'], spacer: true }),
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
    upload: (files: File[]) => {
      const f = files.map(file => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }))
      return Promise.resolve(f)
    },
  }),
  Blockquote,
  SlashCommand,
  HorizontalRule,
  Fullscreen.configure({ spacer: true }),
  CodeBlock.configure({ lowlight: createLowlight(common) }),
  Table,
  Code,
  ImportWord.configure({
    upload: (files: File[]) => {
      console.log('files', files)
      const f = files.map(file => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }))
      return Promise.resolve(f)
    },
  }),
  ExportWord,
  AI.configure({
    completions: AICompletions,
  }),
]
async function AICompletions(prompt: string, text: string, signal?: AbortSignal) {
  // recommend https://groq.com
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  const baseURL = import.meta.env.VITE_OPENAI_BASE_URL
  const model = import.meta.env.VITE_OPENAI_MODEL
  if (!apiKey || !baseURL || !model) {
    throw new Error('OpenAI configuration is missing. Please check your environment variables.')
  }
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
    baseURL: baseURL,
  })
  const system = 'be a helpful assistant'
  try {
    const stream = await openai.chat.completions.create(
      {
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: `${prompt} :${text}` },
        ],
        stream: true,
      },
      { signal }
    )
    return stream
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in AI Completions:', error.message)
    }
    throw error
  }
}
</script>
