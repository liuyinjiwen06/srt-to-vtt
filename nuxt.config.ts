// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],
  i18n: {
    lazy: true,
    langDir: './locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    debug: true,
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
        iso: 'en-US'
      },
      {
        code: 'zh',
        name: '中文',
        file: 'zh.json',
        iso: 'zh-CN'
      },
      {
        code: 'pt',
        name: 'Português',
        file: 'pt.json',
        iso: 'pt-BR'
      },
      {
        code: 'es',
        name: 'Español',
        file: 'es.json',
        iso: 'es-ES'
      },
      {
        code: 'fr',
        name: 'Français',
        file: 'fr.json',
        iso: 'fr-FR'
      },
      {
        code: 'ar',
        name: 'العربية',
        file: 'ar.json',
        iso: 'ar-SA',
        dir: 'rtl'
      },
      {
        code: 'bn',
        name: 'বাংলা',
        file: 'bn.json',
        iso: 'bn-BD'
      },
      {
        code: 'ru',
        name: 'Русский',
        file: 'ru.json',
        iso: 'ru-RU'
      },
      {
        code: 'ur',
        name: 'اردو',
        file: 'ur.json',
        iso: 'ur-PK',
        dir: 'rtl'
      }
    ]
  },
  app: {
    head: {
      title: 'SRT to VTT Converter',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { key: 'description', name: 'description', content: 'Convert SRT subtitle files to VTT format easily with our online tool.' }
      ]
    }
  }
})
