// https://pinia.vuejs.org/ssr/nuxt.html

/**
 * *配置package.json
 * "overrides": {
    "vue": "latest"
   }
 *
 * *配置nuxt.config.ts
 * modules: ["@pinia/nuxt"],
 * pinia: {
    autoImports: ["defineStore", "storeToRefs"],
   },
 */

export const useStore = defineStore("index", () => {
  const count = ref(1);
  return {
    count,
  };
});
