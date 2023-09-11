import { createApp, h } from "vue";

import pinia from "@/plugins/pinia";
import router from "@/plugins/router";
import vuetify from "@/plugins/vuetify";

import App from "@/app/App.vue";

import DevToolLoadingStateMenu from "@/components/utils/DevToolLoadingStateMenu.vue";

createApp({ render: () => h(App) })
  .component("DevToolLoadingStateMenu", DevToolLoadingStateMenu)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .mount("#app");
