import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      external: [
        'pdfjs-dist/build/pdf.worker.min.mjs?url',
        '@craft-agent/mermaid',
        'react-pdf',
        'pdfjs-dist',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-context-menu',
      ],
      onwarn(warning, warn) {
        if (warning.code === 'MISSING_EXPORT' && warning.exporter?.includes('__vite-optional-peer-dep')) return
        warn(warning)
      },
    },
  },
  resolve: {
    alias: {
      '@craft/ui/styles': path.resolve(__dirname, '../src/styles/index.css'),
      '@craft/ui/ui': path.resolve(__dirname, '../src/components/ui/index.ts'),
      '@craft/ui/primitives': path.resolve(__dirname, '../src/components/primitives/index.ts'),
      '@craft/ui/chat': path.resolve(__dirname, '../src/components/chat/index.ts'),
      '@craft/ui/markdown': path.resolve(__dirname, '../src/components/markdown/index.ts'),
      '@craft/ui/code-viewer': path.resolve(__dirname, '../src/components/code-viewer/index.ts'),
      '@craft/ui/terminal': path.resolve(__dirname, '../src/components/terminal/index.ts'),
      '@craft/ui/overlay': path.resolve(__dirname, '../src/components/overlay/index.ts'),
      '@craft/ui/cards': path.resolve(__dirname, '../src/components/cards/index.ts'),
      '@craft/ui/lib': path.resolve(__dirname, '../src/lib/index.ts'),
      '@craft/ui/context': path.resolve(__dirname, '../src/context/index.ts'),
      '@craft/ui/types': path.resolve(__dirname, '../src/types/index.ts'),
      '@craft/ui': path.resolve(__dirname, '../src/index.ts'),
      '@': path.resolve(__dirname, '../src'),
    },
  },
})
