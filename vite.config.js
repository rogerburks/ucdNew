import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'vue-router'

const path = require('path');

export default defineConfig({
    plugins: [
        vue(),
        VueRouter
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
})