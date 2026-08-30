import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './app/router/index'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

async function bootstrap() {
  app.use(router)
  await router.isReady()
  app.mount('#app')
}

void bootstrap()
