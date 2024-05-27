export const DEMO_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { textAlign: 'center', indent: 0, lineHeight: null, level: 1 },
      content: [{ type: 'text', text: 'Echo Editor' }],
    },
    {
      type: 'paragraph',
      attrs: { class: null, textAlign: 'start', indent: 0, lineHeight: null },
      content: [
        { type: 'text', text: 'A modern WYSIWYG AI rich text editor based on ' },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://github.com/scrumpy/tiptap',
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
                class: 'link',
              },
            },
          ],
          text: 'tiptap',
        },
        { type: 'text', text: ' and ' },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.shadcn-vue.com/',
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
                class: 'link',
              },
            },
          ],
          text: 'shadcn ui',
        },
        { type: 'text', text: ' for Vue.js' },
      ],
    },
    { type: 'paragraph', attrs: { class: null, textAlign: 'start', indent: 0, lineHeight: null } },
    {
      type: 'paragraph',
      attrs: { class: null, textAlign: 'center', indent: 0, lineHeight: null },
      content: [
        {
          type: 'image',
          attrs: {
            textAlign: 'center',
            src: 'https://picsum.photos/1920/1080.webp?t=1',
            title: null,
            lockAspectRatio: true,
            width: 500,
            height: null,
            display: 'inline',
          },
        },
      ],
    },
    { type: 'paragraph', attrs: { class: null, textAlign: 'start', indent: 0, lineHeight: null } },
    { type: 'paragraph', attrs: { class: null, textAlign: 'start', indent: 0, lineHeight: null } },
    { type: 'horizontalRule' },
    {
      type: 'heading',
      attrs: { textAlign: 'start', indent: 0, lineHeight: null, level: 2 },
      content: [{ type: 'text', text: 'Demo' }],
    },
    {
      type: 'paragraph',
      attrs: { class: null, textAlign: 'start', indent: 0, lineHeight: null },
      content: [
        { type: 'text', text: '👉' },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://echo-editor.vercel.app/',
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
                class: 'link',
              },
            },
          ],
          text: 'Demo',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { textAlign: 'start', indent: 0, lineHeight: null, level: 2 },
      content: [{ type: 'text', text: 'Features' }],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null },
              content: [
                { type: 'text', text: 'Use ' },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href: 'https://naiveui.com',
                        target: '_blank',
                        rel: 'noopener noreferrer nofollow',
                        class: 'link',
                      },
                    },
                  ],
                  text: 'shadcn ui',
                },
                { type: 'text', text: ' components' },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null },
              content: [{ type: 'text', text: 'Markdown support' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null },
              content: [{ type: 'text', text: 'TypeScript support' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null },
              content: [{ type: 'text', text: 'I18n support' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null },
              content: [{ type: 'text', text: 'Vue 3.x support' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null },
              content: [{ type: 'text', text: 'Slash Command' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null },
              content: [{ type: 'text', text: 'Dark Mode' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null },
              content: [{ type: 'text', text: 'Multi Column' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null },
              content: [{ type: 'text', text: 'AI Power' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null },
              content: [{ type: 'text', text: 'Embed' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null },
              content: [{ type: 'text', text: 'TailwindCss' }],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { textAlign: 'start', indent: 0, lineHeight: null, level: 2 },
      content: [{ type: 'text', text: 'Installation' }],
    },
    {
      type: 'codeBlock',
      attrs: { language: null },
      content: [
        { type: 'text', text: 'pnpm add echo-editor\n// or\nor yarn add echo-editor\n// or\nor npm i echo-editor -S' },
      ],
    },
    {
      type: 'heading',
      attrs: { textAlign: 'left', indent: 0, lineHeight: null, level: 3 },
      content: [{ type: 'text', text: 'install plugin' }],
    },
    {
      type: 'codeBlock',
      attrs: { language: null },
      content: [
        {
          type: 'text',
          text: "import { createApp } from 'vue'\nimport App from './App.vue'\nimport EchoEditor from 'echo-editor'\nimport 'echo-editor/style.css'\nconst app = createApp(App)\napp.use(EchoEditor)\napp.mount('#app')",
        },
      ],
    },
    { type: 'paragraph', attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null } },
  ],
}
