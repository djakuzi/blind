import { defineConfig, searchForWorkspaceRoot } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ['VITE_', 'APP_', 'API_'],
  plugins: [vue()],
  server: {
    fs: {
      // Dev-only: lets agent tools from <repo>/.ai-core be opened via /@fs/ on the dev server.
      allow: [searchForWorkspaceRoot(process.cwd()), fileURLToPath(new URL('../../.ai-core', import.meta.url))],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
