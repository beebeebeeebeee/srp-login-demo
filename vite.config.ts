import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
      port: 8877
    },
    plugins: [react(), nodePolyfills()],
    build: {
        manifest: true,
        rollupOptions: {
            input: "./public/src/main.tsx",
        },
    },
})
