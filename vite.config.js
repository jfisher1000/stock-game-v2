import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import copy from 'rollup-plugin-copy';

// This configuration is updated to use ES Module syntax (import/export)
// which resolves the "Dynamic require of 'path' is not supported" error.

export default defineConfig({
  plugins: [
    // Standard plugin for React projects using Vite
    react(),

    // This plugin is from the Minia template, used for processing HTML files
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
    }),
    
    // This plugin copies assets to the build directory
    copy({
      targets: [
        { src: 'src/assets/images', dest: 'dist/assets' },
        { src: 'src/assets/fonts', dest: 'dist/assets' },
        { src: 'src/assets/js', dest: 'dist/assets' },
        { src: 'src/assets/scss', dest: 'dist/assets' },
      ],
      hook: 'writeBundle'
    })
  ],
  resolve: {
    // This allows you to use `~` as an alias for the `src` folder
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
});
