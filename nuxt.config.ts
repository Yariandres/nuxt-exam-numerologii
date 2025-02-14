// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@prisma/nuxt',
    '@nuxtjs/supabase',
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
  nitro: {
    preset: 'netlify',
  },
  ssr: false,
  app: {
    baseURL: '/',
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
});
