<template>
  <div class="min-h-screen bg-background">
    <header
      class="border-grid w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div class="container flex h-14 items-center sticky">
        <div class="mr-4 md:mr-1 hidden md:flex">
          <a href="/" class="mr-4 md:mr-2 lg:mr-6 flex items-center lg:space-x1 xl:space-x-2">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="mr-2"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 7v10" />
              <path d="M8 9v6" opacity="0.7" />
              <path d="M4 11v2" opacity="0.4" />
              <path d="M16 9v6" opacity="0.7" />
              <path d="M20 11v2" opacity="0.4" />
              <rect x="10" y="5" width="4" height="14" fill="currentColor" opacity="0.1" />
            </svg>
            <span class="font-bold"> Echo Editor </span>
          </a>
          <nav class="flex items-center gap-4 text-sm xl:gap-6"></nav>
        </div>
        <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div class="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav class="flex items-center gap-0.5">
            <a
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground w-8 h-8"
              href="https://github.com/Seedsa/echo-editor"
              target="_blank"
              ><svg viewBox="0 0 15 15" width="1.2em" height="1.2em" class="w-4 h-4">
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M7.5.25a7.25 7.25 0 0 0-2.292 14.13c.363.066.495-.158.495-.35c0-.172-.006-.628-.01-1.233c-2.016.438-2.442-.972-2.442-.972c-.33-.838-.805-1.06-.805-1.06c-.658-.45.05-.441.05-.441c.728.051 1.11.747 1.11.747c.647 1.108 1.697.788 2.11.602c.066-.468.254-.788.46-.969c-1.61-.183-3.302-.805-3.302-3.583a2.8 2.8 0 0 1 .747-1.945c-.075-.184-.324-.92.07-1.92c0 0 .61-.194 1.994.744A7 7 0 0 1 7.5 3.756A7 7 0 0 1 9.315 4c1.384-.938 1.992-.743 1.992-.743c.396.998.147 1.735.072 1.919c.465.507.745 1.153.745 1.945c0 2.785-1.695 3.398-3.31 3.577c.26.224.492.667.492 1.343c0 .97-.009 1.751-.009 1.989c0 .194.131.42.499.349A7.25 7.25 0 0 0 7.499.25"
                  clip-rule="evenodd"
                ></path></svg></a
            ><button
              @click="colorMode.toggleTheme()"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground w-8 h-8"
              aria-label="Toggle dark mode"
            >
              <svg
                v-if="colorMode.theme.value === 'dark'"
                viewBox="0 0 24 24"
                width="1.2em"
                height="1.2em"
                class="w-4 h-4 text-foreground"
              >
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <circle cx="12" cy="12" r="4"></circle>
                  <path
                    d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                  ></path>
                </g>
              </svg>
              <svg v-else viewBox="0 0 24 24" width="1.2em" height="1.2em" class="w-4 h-4 text-foreground">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9"
                ></path>
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </header>

    <main class="my-0 mx-auto max-w-[1024px] p-6">
      <div class="mb-2">
        <button
          class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          @click="locale.setLang('zhHans')"
        >
          中文
        </button>
        <button
          class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          @click="locale.setLang('en')"
        >
          English
        </button>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <EchoEditor :extensions="extensions" v-model="content" :maxHeight="512" output="html" />
      </div>
      <div class="mt-6 rounded-lg border bg-muted p-4">
        <h3 class="mb-2 text-sm font-medium">HTML Output</h3>
        <div class="rounded bg-muted-foreground/5 max-h-[500px] overflow-auto">
          <span>{{ content }}</span>
        </div>
      </div>
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
  locale,
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
  Iframe,
} from '../index'
import { JSONContent } from '../index'
import { DEMO_CONTENT } from './content'
import { createLowlight, common } from 'lowlight'
import OpenAI from 'openai'
import { useColorMode } from './useColorMode'

const content = ref<string | JSONContent>(DEMO_CONTENT)
const colorMode = useColorMode()

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
    upload: handleFileUpload,
  }),
  Blockquote,
  SlashCommand,
  HorizontalRule,
  Fullscreen.configure({ spacer: true }),
  CodeBlock.configure({ lowlight: createLowlight(common) }),
  Table,
  Code,
  AI.configure({
    completions: AICompletions,
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
    upload: handleFileUpload,
  }),
  FindAndReplace.configure({ spacer: true }),
  Printer,
  Preview,
  Iframe,
]

async function handleFileUpload(files: File[]) {
  const f = files.map(file => ({
    src: URL.createObjectURL(file),
    alt: file.name,
  }))
  return Promise.resolve(f)
}
/**
 * AI Completions handler function
 * WARNING: This is just a demo implementation. In production:
 * - DO NOT expose API keys in the frontend
 * - DO implement this through your backend API
 * - DO add proper error handling and rate limiting
 *
 * @param history - Chat history array containing messages with role and content
 * @param signal - AbortSignal for cancelling requests
 * @returns OpenAI chat completion stream
 */
async function AICompletions(history: Array<{ role: string; content: string }> = [], signal?: AbortSignal) {
  // groq.com For free llm api recommend deepseek r1 70b
  // SECURITY WARNING: API keys should never be exposed in the frontend
  // This is just for demo purposes
  // In production, implement this through your backend API
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

  const systemMsg = `Only answer the question based on the context provided below. The response should be in HTML format, preserving all HTML tags, links, and styles.`

  const systemPrompt = [{ role: 'system', content: systemMsg }]
  const finalMessages = [...systemPrompt]

  if (history.length > 0) {
    finalMessages.push(...history)
  }

  try {
    const stream = await openai.chat.completions.create(
      {
        model,
        messages: finalMessages,
        temperature: 0.7,
        stream: true,
        reasoning_format: 'parsed', // groq deepseek r1 need this
      } as any,
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
