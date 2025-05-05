import { defineConfig } from 'vite'
import { VitePWA }    from 'vite-plugin-pwa'

export default defineConfig({
  // AQUI:
  preview: {
    // o default do connect‐history‐api‐fallback já ignora URLs com ponto,
    // mas se quiseres reforçar:
    historyApiFallback: {
      // false = só faz fallback em rotas *sem* “.” (ex.: /foo/bar)
      // logo, /foo.pdf não cai no index.html
      disableDotRule: false
    }
  },

  build: { outDir: 'dist' },

  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'icons/192.png',
        'icons/512.png',
        'icons/maskable-512.png',
        // certifica-te que os PDFs estão aqui para serem copiados para /dist
        'cert_cibercrime.pdf',
        'estagio_verao.pdf',
        'cert_sustentabilidade.pdf'
      ],
      manifest: { /* … */ },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,


        globPatterns: ['**/*.{js,css,html,png,svg,pdf}'],
        navigateFallback: '/',
        navigateFallbackDenylist: [/\.pdf$/],
        runtimeCaching: [
          {
            urlPattern: /\/.*\.pdf$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pdf-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          /* …restante runtimeCaching… */
        ]
      }
    })
  ]
})
