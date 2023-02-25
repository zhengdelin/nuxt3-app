// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          charset: "utf-8",
        },
      ],
      title: "nuxt-app",
      link: [
        //     // <link rel="stylesheet" href="https://myawesome-lib.css">
        //   { rel: 'stylesheet', href: 'https://awesome-lib.css' }
      ],
      script: [
        // // <script src="https://myawesome-lib.js"></script>
        // { src: "https://awesome-lib.js" },
      ],
      noscript: [
        // <noscript>JavaScript is required</noscript>
        {
          children: "JavaScript is required",
        },
      ],
    },
  },

  typescript: {
    shim: false,
    strict: true,
    // typeCheck: true,
  },

  // You can define the CSS files/modules/libraries you want to set globally (included in every page).
  css: ["~/assets/css/app.scss"],

  // An array of nuxt app plugins.
  plugins: ["~/plugins/array"],

  modules: ["@pinia/nuxt", "nuxt-windicss"],

  pinia: {
    autoImports: ["defineStore", "storeToRefs"],
  },

  runtimeConfig: {
    // The private keys which are only available within server-side
    // apiSecret: "123",
    // Keys within public, will be also exposed to the client-side
    public: {
      API_URL: process.env.API_URL,
    },
  },
});
