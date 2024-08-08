import { createApp } from 'vue'
import App from './App.vue'
import EchoEditor from 'echo-editor'
import './style.css'
import 'echo-editor/style.css'
const app = createApp(App)
app.use(EchoEditor)

app.mount('#app')
