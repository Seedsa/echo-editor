export const DEMO_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { textAlign: 'start', level: 1 },
      content: [{ type: 'text', text: 'Echo Editor' }],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'start' },
      content: [
        {
          type: 'text',
          text: '一个现代的所见即所得的AI富文本编辑器基于 ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://github.com/scrumpy/tiptap',
                target: '_blank',
                class: null,
              },
            },
          ],
          text: 'tiptap',
        },
        { type: 'text', text: ' 和 ' },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.naiveui.com',
                target: '_blank',
                class: null,
              },
            },
          ],
          text: 'shadcn ui',
        },
        { type: 'text', text: ' for Vue.js' },
      ],
    },

    { type: 'paragraph', attrs: { textAlign: 'start' } },
    { type: 'paragraph', attrs: { textAlign: 'start' } },
    { type: 'horizontalRule' },
    {
      type: 'heading',
      attrs: { textAlign: 'start', level: 2 },
      content: [{ type: 'text', text: 'CodeSandBox  Demo' }],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'start' },
      content: [
        { type: 'text', text: '👉' },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: '',
                target: '_blank',
                class: null,
              },
            },
          ],
          text: 'comming soon',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { textAlign: 'start', level: 2 },
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
              attrs: { textAlign: 'left' },
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
                        class: null,
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
              attrs: { textAlign: 'left' },
              content: [{ type: 'text', text: 'Markdown support' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { textAlign: 'left' },
              content: [{ type: 'text', text: 'TypeScript support' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { textAlign: 'left' },
              content: [
                { type: 'text', text: 'I18n support(' },
                {
                  type: 'text',
                  marks: [{ type: 'code' }],
                  text: 'zhHans only others comming soon...',
                },
                { type: 'text', text: ')' },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { textAlign: 'left' },
              content: [{ type: 'text', text: 'NaiveUI and Vue 3.x support' }],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { textAlign: 'start', level: 2 },
      content: [{ type: 'text', text: 'Installation' }],
    },
    {
      type: 'heading',
      attrs: { textAlign: 'start', level: 3 },
      content: [{ type: 'text', text: 'NPM' }],
    },

    {
      type: 'codeBlock',
      attrs: { language: null },
      content: [
        {
          type: 'text',
          text: 'pnpm add echo-editor\n# or\nyarn add echo-editor\n# or\nnpm i echo-editor -S',
        },
      ],
    },
  ],
}
