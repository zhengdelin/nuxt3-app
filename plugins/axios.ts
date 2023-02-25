import { NuxtApp } from "#app";
import { injectAllAPI } from "~~/api";
import { useAxios } from "~~/api/AxiosConfig";

export default defineNuxtPlugin((app) => {
  // console.log("Object.keys(app) :>> ", Object.keys(app));
  const _baseURL = app?.payload?.config?.public?.API_URL;
  const baseURL = `${_baseURL}/api/v0`;
  // console.log("appConfig1 :>> ", baseURL);
  const nuxtApp = app as NuxtApp;
  const queryHandlers = useAxios(baseURL, nuxtApp);

  return {
    provide: {
      api: injectAllAPI(queryHandlers, nuxtApp),
    },
  };
});
