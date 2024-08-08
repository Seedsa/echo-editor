# Echo Editor

A modern WYSIWYG rich-text editor base on [tiptap](https://tiptap.dev) uses [shadcn-vue](https://www.shadcn-vue.com/) components.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![](https://img.shields.io/npm/v/echo-editor.svg?label=version)](https://www.npmjs.com/package/echo-editor)
[![](https://img.shields.io/npm/dependency-version/echo-editor/peer/vue?color=vue)](https://www.npmjs.com/package/echo-editor)

English | [中文](./README.zh-CN.md)

![App Screenshot](./screenshot/screenshot.png)

## Demo

[Demo](https://echo-editor.jzcloud.site/)

## Features

- Use [shadcn-vue](https://www.shadcn-vue.com/) components
- Markdown support
- TypeScript support
- I18n support(`en`, `zhHans`)
- Create your own extensions
- Tailwind CSS support

## Installation

```bash
  npm install echo-editor
  pnpm install echo-editor
  yarn add echo-editor
```

## Usage

```
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import EchoEditor from 'echo-editor'
import 'echo-editor/style.css'

const app = createApp(App)

app.use(EchoEditor)

app.mount('#app')

```

```
// App.vue
<script setup>
import {
  BaseKit,
} from 'echo-editor';

const extensions = [
  BaseKit.configure({
    placeholder: {
      placeholder: '请输入...',
    },
})]
</script>

<template>
<echo-editor
    :extensions="extensions"
/>
</template>
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/Seedsa/echo-editor.git
```

Go to the project directory

```bash
  cd echo-editor
```

Install dependencies

```bash
  pnpm install
```

Start the Demo server

```bash
  npm run build:lib
  npm run dev
```

## Related

Here are some related projects

[shadcn-vue](https://www.shadcn-vue.com/)

[tiptap](https://tiptap.dev)

[iconify](https://icon-sets.iconify.design)

## License

[MIT](https://choosealicense.com/licenses/mit/)
