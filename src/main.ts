import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './app/router';
import { setupNativeView } from './app/setup/nativeView.setup';
import { setupScale } from './app/setup/scale.setup';
import { setupTheme } from './app/setup/theme.setup';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

async function bootstrap() {
  await setupNativeView();
  await setupScale(pinia);
  await setupTheme(pinia);
  app.use(router);
  await router.isReady();
  app.mount('#app');
}

bootstrap();
