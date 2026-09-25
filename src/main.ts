import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './app/router';
import { runPostMountSetup, runPreMountSetup } from './app/setup/core/setup.runner';
import { createAppSetupRegistry } from './app/setup/registry/appSetup.registry';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

async function setupApp() {
  const setups = createAppSetupRegistry(pinia);

  await runPreMountSetup(setups);

  app.use(router);
  await router.isReady();

  app.mount('#app');

  await runPostMountSetup(setups);
}

setupApp();
