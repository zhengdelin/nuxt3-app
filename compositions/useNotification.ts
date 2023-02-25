import { notify } from "@kyvg/vue3-notification";

export const $notify = {
  error(text: string, title?: string) {
    notify({
      text,
      title,
      type: "error",
    });
  },

  success(text: string, title?: string) {
    notify({
      text,
      title,
      type: "success",
    });
  },
};
