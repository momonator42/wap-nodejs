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
      offlinePage: '/offline.html', // Verweist auf die Offline-Seite
      cachingExtensions: '@/plugins/workbox-cache.js',
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
