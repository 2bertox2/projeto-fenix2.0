import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      // Configurações do Manifesto do App
      manifest: {
        name: 'Fênix - Controle F', // Nome completo do app
        short_name: 'Fênix', // Nome curto que aparece abaixo do ícone
        description: 'Um aplicativo para controlar suas finanças pessoais.',
        theme_color: '#3498db', // Cor principal do app (barra de status no celular)
        background_color: '#ffffff', // Cor da tela de carregamento
        display: 'standalone',
        scope: '/',
        start_url: '/',
        // Aqui definimos os ícones!
        icons: [
          {
            src: 'pwa-192x192.png', // Caminho para o ícone na pasta 'public'
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // Caminho para o ícone na pasta 'public'
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Ícone especial para se adaptar a diferentes formatos no Android
          }
        ]
      }
    })
  ],
})