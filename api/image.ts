import { NuxtApp } from "#app";
import { getUploadProgress, useAxios } from "./AxiosConfig";

export function injectImageAPI(query: QueryHandlers, app: NuxtApp) {
  return {
    getFileServer: () => query.get("/files"),
    upload: (data: any, config: CancelableProgressQueryConfig) => {
      const fileServerAxios = useAxios(data.fileServer, app);
      return fileServerAxios.post(`/cdn/1/upload/image?server=${``}`, data.data, {
        onUploadProgress(progressEvent) {
          config.onProgress(getUploadProgress(progressEvent));
        },
        cancelToken: config.cancelToken,
      });
    },
  };
}
