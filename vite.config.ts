import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      outDir: 'lib',
      exclude: ['src/demo/**/*', 'examples/**/*']
    }),
  ],
  optimizeDeps: {
    include: ['vue'],
    exclude: ['examples/*', 'src/demo/*']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()] as any,
    },
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'EchoEditor',
      fileName: (format) => `echo-editor.${format}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {
          vue: 'vue',
        },
        assetFileNames: (info) => {
          if (info.name && info.name.endsWith('.css')) {
            return 'style.css';
          }
          return 'assets/[name].[hash][extname]';
        }
      },
      external: ['vue'],
    },
  },
})
