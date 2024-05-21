# Echo Editor

一款基于 [tiptap](https://tiptap.dev) 和 [shadcn-vue](https://www.shadcn-vue.com/) 组件的下一代富文本编辑器。

[![MIT 许可证](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![](https://img.shields.io/npm/v/echo-editor.svg?label=version)](https://www.npmjs.com/package/echo-editor)
[![](https://img.shields.io/npm/dependency-version/echo-editor/peer/vue?color=vue)](https://www.npmjs.com/package/echo-editor)

[English](./README.md) | 中文

## 演示

[演示](https://echo-editor.vercel.app/)

## 特性

- 使用 [shadcn-vue](https://www.shadcn-vue.com/) 组件
- 支持 Markdown
- 支持 TypeScript
- 国际化支持（`en`, `zhHans`）
- 支持自定义扩展
- Tailwind CSS

## 安装

```bash
  npm install echo-editor
  pnpm install echo-editor
  yarn add echo-editor
```

## 使用

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

## 本地运行

克隆项目

```bash
  git clone https://github.com/Seedsa/echo-editor.git
```

进入项目目录

```bash
  cd echo-editor
```

安装依赖

```bash
  pnpm install
```

启动演示服务器

```bash
  npm run build:lib
  npm run dev
```

## 相关项目

以下是一些相关项目

[shadcn-vue](https://www.shadcn-vue.com/)

[tiptap](https://tiptap.dev)

[iconify](https://icon-sets.iconify.design)

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
