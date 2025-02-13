/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  css: { postcss: { plugins: [] } },
  test: {
    environment: 'happy-dom',
    include: ['./app/**/*.spec.{ts,tsx}'],
    restoreMocks: true,
    coverage: {
      include: ['app/**/*.{ts,tsx}'],
      all: true,
    },
  },
})
