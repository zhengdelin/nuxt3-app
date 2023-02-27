import { setupDebounceThrottleDirectives } from "~~/compositions/useDebounce";

export default defineNuxtPlugin((app) => {
  setupDebounceThrottleDirectives(app.vueApp);
});
