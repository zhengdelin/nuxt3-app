import Notifications from "@kyvg/vue3-notification";
import { $notify } from "~~/composables/useNotification";
export default defineNuxtPlugin((app) => {
  app.vueApp.use(Notifications);

  //   notify({
  //     text: "13",
  //     type: "success",
  //     title: "123",
  //   });
  return {
    provide: {
      notify: $notify,
    },
  };
});
