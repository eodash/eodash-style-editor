import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/eodash-style-editor/',
  plugins: [
    tailwindcss(),
  ],
  server: {
    allowedHosts: ["gtif.eox.world"],
  },
})