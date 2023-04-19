import { setupDebounceThrottleDirectives } from "~~/composables/useDebounceThrottle";

export default defineNuxtPlugin((app) => {
  setupDebounceThrottleDirectives(app.vueApp);
});
