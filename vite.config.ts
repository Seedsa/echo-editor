import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import visualizer from 'rollup-plugin-visualizer'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // visualizer({
    //   open: true,
    //   filename: 'visualizer.html',
    // }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  optimizeDeps: {
    include: ['vue', 'zod', 'vee-validate', '@vee-validate/zod'],
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
