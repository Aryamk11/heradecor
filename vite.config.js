// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
    // 1. Set the project root to the 'src' directory
    root: 'src',

    build: {
        // 2. Set the output directory to be 'dist' at the project root
        outDir: '../dist'
    }
})
