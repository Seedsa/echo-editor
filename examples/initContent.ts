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
        { type: 'text', text: '一个现代的所见即所得的AI富文本编辑器基于 ' },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://github.com/scrumpy/tiptap',
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
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
                href: 'https://www.shadcn-vue.com/',
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
                class: null,
              },
            },
          ],
          text: 'shadcn ui',
        },
        { type: 'text', text: ' for Vue.js' },
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
            { type: 'link', attrs: { href: '', target: '_blank', rel: 'noopener noreferrer nofollow', class: null } },
          ],
          text: 'comming soon',
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
              content: [{ type: 'text', text: 'Embed ' }],
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
      content: [{ type: 'text', text: 'pnpm add echo-editor\n# or\nyarn add echo-editor\n# or\nnpm i echo-editor -S' }],
    },
    { type: 'paragraph', attrs: { class: null, textAlign: 'left', indent: 0, lineHeight: null } },
  ],
}
