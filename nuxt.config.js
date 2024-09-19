export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'wap-webserver',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon.ico' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css' }
    ],
    script: [
      {
        src: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
        type: 'text/javascript'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/pwa',
  ],

  pwa: {
    manifest: {
      name: 'Mill',
      short_name: 'Mill',
      description: 'Meine PWA mit Nuxt.js',
      lang: 'de',
      display: 'standalone', // macht die App "installierbar"
    },
    workbox: {
      offline: true, // Aktiviert die Offline-Unterstützung
      offlinePage: '/offline', // Verweist auf die Offline-Seite
      runtimeCaching: [
        {
          urlPattern: /\/.*/, // Fängt alle Routen ab (inklusive deiner APIs)
          handler: 'NetworkFirst', // Versucht zuerst, die Daten aus dem Netzwerk zu laden, cached sie aber auch
          method: 'GET', // Gilt für alle GET-Anfragen (z. B. statische Ressourcen)
          options: {
            networkTimeoutSeconds: 10, // Netzwerk-Timeout auf 10 Sekunden setzen
            cacheableResponse: {
              statuses: [0, 200], // Speichert nur 200er-Antworten im Cache
            },
          },
        },
        {
          urlPattern: /\/api\/.*/, // Fängt alle API-Routen ab, die POST-Requests verwenden
          handler: 'NetworkOnly', // POST-Anfragen gehen nur über das Netzwerk, kein Caching
          method: 'POST', // Nur POST-Anfragen
          options: {
            networkTimeoutSeconds: 10, // Netzwerk-Timeout auf 10 Sekunden setzen
            plugins: [
              {
                fetchDidFail: async () => {
                  // Bei Netzwerkausfall auf die offline.vue umleiten
                  return await caches.match('/offline');
                },
              },
            ],
          },
        },
      ],
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {

  },

  serverMiddleware: [
    { path: '/', handler: '~/serverMiddleware/express.js'}
  ],

  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000
  },

  // Hook, um sicherzustellen, dass der WebSocket-Server startet, sobald der Nuxt.js-Server startet
  hooks: {
    listen(server) {
      // Rufe die Funktion auf, die den WebSocket-Server startet
      require('./serverMiddleware/express').setupWebSocketServer(server);
    }
  }

}
