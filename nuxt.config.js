module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'DVS | Decentralized Voting System',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'DVS project' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Expose env variables
   */
  env: {
    API_URL: process.env.API_URL
  },

  /*
   ** Customize the progress bar color
   */
  loading: { color: '#3B8070' },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  modules: ['bootstrap-vue/nuxt', '@nuxtjs/axios']
}
