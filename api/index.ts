import { UseFetchOptions } from "#app";
import { QApiResponse } from "~~/types";
interface ToastConfig {
  success?:
    | {
        message?: string;
      }
    | false;

  error?:
    | {
        message?: string;
      }
    | false;
}

const $query = <T = any>(
  url: string,
  options?: UseFetchOptions<QApiResponse<T>>,
  toastConfig: ToastConfig = { success: { message: "操作成功" }, error: { message: "錯誤" } },
) => {
  const method = options?.method || "GET";
  const config = useRuntimeConfig();
  const baseURL = `${config.public.apiBase}/agent/api`;
  const token = "";
  return useFetch(url, {
    ...options,
    key: `${url}${method}${Date.now()}`,
    headers: {
      Authorizations: token,
    },
    baseURL,
    onResponse({ request, response }) {
      if (process.dev) {
        console.group();
        console.table({ request });
        console.log(response);
        console.groupEnd();
      }
      if (toastConfig.success) {
        //
      }
    },
    async onResponseError({ request, response }) {
      if (process.dev) {
        console.group();
        console.table({ request });
        console.error(response);
        console.groupEnd();
      }
      // console.log('[fetch response error]')
      // console.log(response.status);
    },

    // async onRequest({ request, options }) {
    //   // console.log('[fetch request]')
    // },
    async onRequestError({ request, error }) {
      if (process.dev) {
        console.group();
        console.error(error);
        console.table({ request, errorName: error.name, error: error.message });
        console.groupEnd();
      }
    },
  });
};

// type FetchReturnType<T> = ReturnType<typeof fetchAgent<T>>;
// type FetchReturnTypeDataValue<T> = FetchReturnType<T>["data"]["value"];
// type WatchableParam<T> = Ref<T>;

export const $api = {
  login: () => $query("/login"),
};
