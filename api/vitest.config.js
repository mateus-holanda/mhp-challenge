/// <reference types="vitest" />

import swc from 'unplugin-swc'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    include: ['./src/**/*.spec.ts'],
    restoreMocks: true,
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.module.ts'],
      all: true,
    },
  },
})
