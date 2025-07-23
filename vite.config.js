// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'src', // ✅ point to the folder with index.html
  build: {
    outDir: '../dist',     // ✅ put build output outside src
    emptyOutDir: true,
  }
})
