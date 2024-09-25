<template>
  <div>
    <header class="p-3 flex gap-3 justify-center w-full bg-accent text-foreground">
      <button ghost @click="locale.setLang('zhHans')">中文</button>
      <button ghost @click="locale.setLang('en')">English</button>
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
    <div
      class="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1 bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800"
    >
      <button
        @click="theme = 'light'"
        :class="[theme === 'light' && 'bg-neutral-200 dark:bg-neutral-900']"
        class="hover:bg-neutral-100 active:bg-neutral-200 dark:hover:bg-neutral-900 dark:active:bg-neutral-800 py-2 px-2 flex group items-center justify-center border border-transparent gap-2 text-sm font-semibold rounded-md disabled:opacity-50 whitespace-nowrap"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-sun w-4 h-4"
        >
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg></button
      ><button
        @click="theme = 'dark'"
        :class="[theme === 'dark' && 'dark:bg-neutral-900 dark:active:bg-neutral-800']"
        class="hover:bg-neutral-100 active:bg-neutral-200 dark:hover:bg-neutral-900 dark:active:bg-neutral-800 py-2 px-2 flex group items-center justify-center border border-transparent gap-2 text-sm font-semibold rounded-md disabled:opacity-50 whitespace-nowrap"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-moon w-4 h-4"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
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
  FontFamily,
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

const AIShortcuts = ref([
  {
    label: 'Generate from selection',
    children: [
      {
        label: 'Improve writing',
        prompt:
          'Rewrite this content with no spelling mistakes, proper grammar, and with more descriptive language, using best writing practices without losing the original meaning.',
      },
      {
        label: 'Make shorter',
        prompt:
          'Remove any repetitive, redundant, or non-essential writing in this content without changing the meaning or losing any key information.',
      },
      {
        label: 'Make longer',
        prompt:
          'Expand upon this content with descriptive language and more detailed explanations, to make the writing easier to understand and increase the length of the content.',
      },
      {
        label: 'Summarize',
        prompt: 'Provide the key points and concepts in this content in a succinct summary.',
      },
      {
        label: 'Continue',
        prompt:
          'Expand and continue this content, maintaining the original tone and style. Ensure that the continuation flows naturally from the existing writing while adding new ideas, further details, or continuing the narrative or argument in a coherent manner.',
      },
    ],
  },

  {
    label: 'Change Tone',
    children: [
      {
        label: 'Professional',
        prompt:
          'Rewrite this content using polished, formal, and respectful language to convey professional expertise and competence.',
      },
      {
        label: 'Casual',
        prompt:
          'Rewrite this content with casual, informal language to convey a casual conversation with a real person.',
      },
      {
        label: 'Direct',
        prompt: 'Rewrite this content with direct language using only the essential information.',
      },
      {
        label: 'Confident',
        prompt: 'Rewrite this content using compelling, optimistic language to convey confidence in the writing.',
      },
      {
        label: 'Friendly',
        prompt: 'Rewrite this content using friendly, comforting language, to convey understanding and empathy.',
      },
    ],
  },
  {
    label: 'Change Style',
    children: [
      {
        label: 'Business',
        prompt: 'Rewrite this content as a business professional with formal language.',
      },
      {
        label: 'Legal',
        prompt: 'Rewrite this content as a legal professional using valid legal terminology.',
      },
      {
        label: 'Journalism',
        prompt:
          'Rewrite this content as a journalist using engaging language to convey the importance of the information.',
      },
      {
        label: 'Medical',
        prompt: 'Rewrite this content as a medical professional using valid medical terminology.',
      },
      {
        label: 'Poetic',
        prompt: 'Rewrite this content as a poem using poetic techniques without losing the original meaning.',
      },
    ],
  },
  {
    label: 'Translate',
    children: [
      {
        label: 'English',
        prompt: 'Translate this content to English language.',
      },
      {
        label: 'Simplified Chinese',
        prompt: 'Translate this content to Simplified Chinese language.',
      },
      {
        label: 'Spanish',
        prompt: 'Translate this content to Simplified Spanish language.',
      },
      {
        label: 'German',
        prompt: 'Translate this content to Simplified German language.',
      },
      {
        label: 'French',
        prompt: 'Translate this content to Simplified French language.',
      },
      {
        label: 'Portuguese',
        prompt: 'Translate this content to Simplified Portuguese language.',
      },
      {
        label: 'Korean',
        prompt: 'Translate this content to Simplified Korean language.',
      },
      {
        label: 'Japanese',
        prompt: 'Translate this content to Simplified Japanese language.',
      },
      {
        label: 'Hindi',
        prompt: 'Translate this content to Simplified Hindi language.',
      },
      {
        label: 'Arabic',
        prompt: 'Translate this content to Simplified Arabic language.',
      },
    ],
  },
])
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
    upload: handleFileUpload,
  }),
  Blockquote,
  SlashCommand,
  HorizontalRule,
  Fullscreen.configure({ spacer: true }),
  CodeBlock.configure({ lowlight: createLowlight(common) }),
  Table,
  Code,
  ImportWord.configure({
    upload: handleFileUpload,
  }),
  ExportWord,
  AI.configure({
    completions: AICompletions,
    shortcuts: AIShortcuts.value,
  }),
]
async function handleFileUpload(files: File[]) {
  const f = files.map(file => ({
    src: URL.createObjectURL(file),
    alt: file.name,
  }))
  return Promise.resolve(f)
}

async function AICompletions(prompt: string, context: string) {
  // https://groq.com or https://siliconflow.cn/zh-cn for free llm api
  // currently, continuous conversation is not supported.need find better way to do this
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
  const systemMsg = [
    'Answer the question based on the context below.',
    'The response should be in HTML format.',
    'The response should preserve any HTML formatting, links, and styles in the context.',
  ]
  const systemPrompt = systemMsg.map(item => ({ role: 'system', content: item }))
  const userPrompt = [
    {
      role: 'user',
      content: `Question: ${prompt} Context:${context}`,
    },
  ]
  const finalMessages: any = [...systemPrompt, ...userPrompt]

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages: finalMessages,
      temperature: 0.7,
      stream: true,
    })
    return stream
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in AI Completions:', error.message)
    }
    throw error
  }
}
</script>
