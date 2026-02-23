import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function normalizeBasePath(basePath) {
  if (!basePath) return '/'
  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true'
const defaultPagesBasePath = repoName ? `/${repoName}/` : '/'
const basePath = normalizeBasePath(
  process.env.VITE_BASE_PATH || (isGitHubPagesBuild ? defaultPagesBasePath : '/')
)

export default defineConfig({
  base: basePath,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          state: ['@reduxjs/toolkit', 'react-redux', 'redux'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-switch', 'lucide-react', 'swiper'],
          network: ['axios', 'socket.io-client', 'sweetalert2'],
        },
      },
    },
  },
})
