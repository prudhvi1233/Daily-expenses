import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png'
      ],

      manifest: {
        name: 'Expenses',
        short_name: 'Expenses',

        description: 'Personal Expense Tracking & Analytics',

        theme_color: '#0B0F17',
        background_color: '#0B0F17',

        display: 'standalone',

        orientation: 'portrait',

        start_url: '/',
        scope: '/',

        icons: [
          {
            src: 'app-icon.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
