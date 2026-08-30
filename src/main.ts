import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './app/router';
import { setupScale } from './app/setup/scale.setup';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

async function bootstrap() {
  await setupScale(pinia);
  app.use(router);
  await router.isReady();
  app.mount('#app');
}

bootstrap();
