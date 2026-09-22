export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
    '@nuxtjs/seo'
  ],
  devtools: { enabled: true },

  site: {
    url: 'fairy.li',
    name: 'Fairy.li',
    description: 'Fairy',
    defaultLocale: 'zh_CN',
    indexable: true,
    env: 'production',
    trailingSlash: false
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark' // Default color
  },

  ui: {
    theme: {
      colors: ['gray', 'red']
    }
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2024-07-30',

  hub: {
    blob: true
  },

  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  },

  seo: {
    redirectToCanonicalSiteUrl: false
  }
})
