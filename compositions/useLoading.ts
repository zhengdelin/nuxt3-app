export function useLoading(loadingWhenPageStart = false) {
  const isLoading = ref(false);
  if (loadingWhenPageStart) {
    const nuxtApp = useNuxtApp();
    const cancelPageStart = nuxtApp.hook("page:start", _ => {
      // console.log("onPageStart", { ...params });
      isLoading.value = true;
    });
    const cancelPageFinish = nuxtApp.hook("page:finish", _ => {
      // console.log("onPageFinish", { ...params });
      isLoading.value = false;
    });
    onUnmounted(() => {
      cancelPageStart();
      cancelPageFinish();
    });
  }

  async function loadingHandler<T>(executor: () => Promise<T>) {
    isLoading.value = true;
    const res = await executor();
    isLoading.value = false;
    return res;
  }
  return {
    isLoading,
    loadingHandler,
  };
}
