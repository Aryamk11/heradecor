// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'src',
    envDir: '../', 
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                about: resolve(__dirname, 'src/about.html'),
                products: resolve(__dirname, 'src/products.html'),
                productDetail: resolve(__dirname, 'src/product-detail.html'),
            },
        },
    },
});