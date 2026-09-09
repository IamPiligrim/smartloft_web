import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set by the GitHub Pages workflow to "/<repo>/" for project pages;
  // defaults to "/" for local dev, `vercel`/`netlify`-style hosting, or a custom domain.
  base: process.env.VITE_BASE_PATH ?? '/',
})
