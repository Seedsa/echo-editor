import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import visualizer from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // visualizer({
    //   open: true,
    //   filename: 'visualizer.html',
    // }),
    AutoImport({
      // dirs: ['./src/hooks'],
      imports: ['vue', '@vueuse/core'],
    }),
    Components({
      dirs: ['./src/components'],
    }),
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
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
    preprocessorOptions: {
      scss: {
        charset: false,
      },
    },
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'EchoEditor',
    },
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {
          vue: 'vue',
        },
      },
      external: ['vue'],
    },
  },
})
