# Echo Editor

一款基于 [tiptap](https://tiptap.dev) 和 [shadcn-vue](https://www.shadcn-vue.com/) 的新一代 AI 富文本编辑器。

[![MIT 许可证](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![](https://img.shields.io/npm/v/echo-editor.svg?label=version)](https://www.npmjs.com/package/echo-editor)
[![](https://img.shields.io/npm/dependency-version/echo-editor/peer/vue?color=vue)](https://www.npmjs.com/package/echo-editor)

[English](./README.md) | 中文

![应用截图](./screenshot/screenshot.png)

## 在线演示

[查看演示](https://echo-editor.jzcloud.site/)

## 特性

- 🎨 使用 [shadcn-vue](https://www.shadcn-vue.com/) 精美组件
- ✨ AI 智能写作辅助
- 📝 支持 Markdown 及实时预览
- 🔤 丰富的文本格式化功能（标题、列表、引用等）
- 📊 表格和代码块支持
- 🎯 自定义字体大小和样式
- 📄 支持导入 Word 文档
- 🌍 国际化支持（`en`、`zhHans`）
- 🧩 可扩展架构 - 支持自定义扩展
- 🎭 TypeScript 支持
- 🎨 Tailwind CSS 支持

## 安装

```bash
npm install echo-editor
# 或
pnpm install echo-editor
# 或
yarn add echo-editor
```

## 使用方法

### 方式一：全局注册

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import EchoEditor from 'echo-editor'
import 'echo-editor/style.css'

const app = createApp(App)
app.use(EchoEditor)
app.mount('#app')
```

```ts
<script setup>
import { BaseKit } from 'echo-editor'

const content = ref('')
const extensions = [
  BaseKit.configure({
    placeholder: {
      placeholder: '开始写作...',
    },
  }),
]
</script>

<template>
  <echo-editor :extensions="extensions" v-model="content" />
</template>
```

### 方式二：直接使用

```ts
<script setup>
import { EchoEditor, BaseKit } from 'echo-editor'
import 'echo-editor/style.css'

const content = ref('')
const extensions = [
  BaseKit.configure({
    placeholder: {
      placeholder: '开始写作...',
    },
  }),
]
</script>

<template>
  <echo-editor :extensions="extensions" v-model="content" />
</template>
```

## 开发

1. 安装 [pnpm](https://pnpm.io/installation)
2. 克隆仓库
3. 运行 `pnpm install`
4. 使用 `pnpm dev` 启动开发服务器

测试构建版本：

```bash
pnpm examples
```

## 贡献

欢迎提交 Pull Request 来帮助改进项目！

## 相关项目

- [shadcn-vue](https://www.shadcn-vue.com/)
- [tiptap](https://tiptap.dev)
- [iconify](https://icon-sets.iconify.design)

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
