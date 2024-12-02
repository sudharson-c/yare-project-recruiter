import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import path for resolving aliases

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env': env, // Make environment variables globally available
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // Alias to src directory
      },
    },
  };
});
