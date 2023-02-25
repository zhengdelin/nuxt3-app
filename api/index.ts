import { NuxtApp } from "#app";
import { injectAuthAPI } from "./auth";
import { injectGlobalAPI } from "./global";
import { injectImageAPI } from "./image";

export function injectAllAPI(queryHandlers: QueryHandlers, app: NuxtApp) {
  return {
    auth: injectAuthAPI(queryHandlers),
    global: injectGlobalAPI(queryHandlers),
    image: injectImageAPI(queryHandlers, app),
  };
}
