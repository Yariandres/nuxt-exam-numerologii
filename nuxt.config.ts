// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    // '@prisma/nuxt',
    // causes an error on netlify. Uncaught TypeError: Failed to resolve module specifier ".prisma/client/index-browser". Relative references must start with either "/", "./", or "../".
  ],
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/auth',
      callback: '/confirm',
      exclude: ['/', '/auth', '/students/**'],
    },
    cookieOptions: {
      name: 'sb-access-token',
      lifetime: 60 * 60 * 8, // 8 hours
      domain: '',
      path: '/',
      sameSite: 'lax',
    },
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap',
          rel: 'stylesheet',
        },
      ],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
});
