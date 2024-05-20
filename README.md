# Echo Editor

A modern WYSIWYG rich-text editor using tiptap for Vue.js

## Installation

Install with npm

```bash
  npm install echo-editor
```

Or yarn

```bash
yarn add echo-editor
```

## Install Plugin

```javascript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import EchoEditor from 'echo-editor'
import 'echo-editor/lib/style.css'

const app = createApp(App)

app.use(EchoEditor)

app.mount('#app')
```

## Usage/Examples

```
import {
  BaseKit,
} from 'echo-editor';

const extensions = [
  BaseKit.configure({
    placeholder: {
      placeholder: '请输入...',
    },
})]

<echo-editor
      :extensions="extensions"
      :max-height="465"
      :min-height="300"
      maxWidth="900"
/>
```

## Run Locally

Clone the project

```bash
  git clone http://gogs.ltit.info/liji/echo-editor
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
  npm run dev
```

## Related

Here are some related projects

[Tiptap](https://tiptap.dev)

[Iconify](https://icon-sets.iconify.design)
