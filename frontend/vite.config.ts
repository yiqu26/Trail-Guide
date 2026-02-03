import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // 有更新時提示用戶
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        name: 'Trail Guide 步道導覽',
        short_name: 'Trail Guide',
        description: '台灣步道資訊平台 - 探索、打卡、收集成就',
        theme_color: '#2E7D32',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // 緩存策略
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst', // API 請求優先使用網路
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 // 1 小時
              }
            }
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst', // 圖片優先使用緩存
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 天
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5174,
    allowedHosts: ['trail.ngo-management-hub.com'],
  },
})
