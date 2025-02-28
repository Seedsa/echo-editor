<template>
  <div class="min-h-screen bg-background">
    <header
      class="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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

    <div class="my-0 mx-auto max-w-[1024px] p-6">
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
        <button
          class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          @click="hideToolbar = !hideToolbar"
        >
          {{ !hideToolbar ? 'Hide Toolbar' : 'Show Toolbar' }}
        </button>
        <button
          class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          @click="hideMenubar = !hideMenubar"
        >
          {{ !hideMenubar ? 'Hide Menubar' : 'Show Menubar' }}
        </button>
        <button
          class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          @click="disabled = !disabled"
        >
          {{ disabled ? 'Editable' : 'Readonly' }}
        </button>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <echo-editor
          v-model="content"
          :extensions="extensions"
          :hideToolbar="hideToolbar"
          :hideMenubar="hideMenubar"
          :disabled="disabled"
          :maxHeight="512"
          output="html"
          :dark="theme === 'dark'"
        >
        </echo-editor>
      </div>
      <div class="mt-6 rounded-lg border bg-muted p-4">
        <h3 class="mb-2 text-sm font-medium">HTML Output</h3>
        <div class="rounded bg-muted-foreground/5 max-h-[500px] overflow-auto">
          <span>{{ content }}</span>
        </div>
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
  FontFamily,
  FindAndReplace,
  Code,
  AI,
  Preview,
  Printer,
} from 'echo-editor'
import { ExportWord } from './extensions/ExportWord'
import OpenAI from 'openai'
import { DEMO_CONTENT } from './initContent'
import { createLowlight, common } from 'lowlight'
import { useColorMode } from './composables/useColorMode'

const content = ref(DEMO_CONTENT)
const theme = ref<string | null>(null)
const hideToolbar = ref<boolean>(false)
const hideMenubar = ref<boolean>(false)
const disabled = ref<boolean>(false)

const colorMode = useColorMode()

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
  ExportWord,
  AI.configure({
    completions: AICompletions,
    shortcuts: AIShortcuts.value,
  }),
  ImportWord.configure({
    upload: handleFileUpload,
  }),
  FindAndReplace.configure({ spacer: true }),
  Printer,
  Preview,
]
async function handleFileUpload(files: File[]) {
  const f = files.map(file => ({
    src: URL.createObjectURL(file),
    alt: file.name,
  }))
  return Promise.resolve(f)
}

async function AICompletions(history: Array<{ role: string; content: string }> = [], signal?: AbortSignal) {
  // groq.com for free llm api,recommend deepseek r1 70b
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
