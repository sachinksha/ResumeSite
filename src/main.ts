import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import './assets/styles/theme.css'
import './assets/styles/base.css'
import './assets/styles/utilities.css'
import './assets/styles/print.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
