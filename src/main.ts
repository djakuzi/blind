import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './app/router';
import { createAppSetupRegistry } from './app/setup/registry/appSetup.registry';
import { runPostMountSetup, runPreMountSetup } from './core/lifecycle/setup/setup.runner';

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
