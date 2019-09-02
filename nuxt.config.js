import pkg from './package'

export default {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: "apple-mobile-web-app-capable", content:"yes" },
      //{ 'http-equiv': 'Content-Security-Policy', content: "default-src *; style-src * 'self' 'unsafe-inline' 'unsafe-eval'; script-src * 'self' 'unsafe-inline' 'unsafe-eval';" },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ],
    script: [
      { src: 'cordova.js', ssr: false },
    ],
  },
  dev: process.env.NODE_ENV === 'DEV',

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/global.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/init', ssr: false },
    { src: '~/plugins/vue-touch', ssr: false },
    { src: '~/plugins/cordova', ssr: false },
  ],

  router: {
    middleware: ['welcome'],
    mode: 'hash',
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, { isDev, isClient }) {
			if (!isDev) {
				// relative links, please.
				config.output.publicPath = './nuxt/'
			}
			return config;
    },
    publicPath: '/nuxt/',
  },
  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  }
}
