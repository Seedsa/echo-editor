import { createApp } from 'vue'
import App from './App.vue'
import EchoEditor from '../index'
import '../styles/index.css'

const app = createApp(App)
app.use(EchoEditor)

app.mount('#app')
