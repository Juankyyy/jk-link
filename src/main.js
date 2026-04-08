import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import { initializeTheme } from '@/lib/theme'

import App from './App.vue'
import router from './router'

initializeTheme()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
