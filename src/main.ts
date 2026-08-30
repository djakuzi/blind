import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './app/router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

async function bootstrap() {
  app.use(router)
  await router.isReady()
  app.mount('#app')
}

bootstrap()
