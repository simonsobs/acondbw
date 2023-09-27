import { createApp, h } from "vue";

import pinia from "@/plugins/pinia";
import router from "@/plugins/router";
import vuetify from "@/plugins/vuetify";

import App from "@/app/App.vue";

import DevToolLoadingStateMenu from "@/components/utils/DevToolLoadingStateMenu.vue";
import DevToolCheckboxes from "@/components/utils/DevToolCheckboxes.vue";

createApp({ render: () => h(App) })
  .component("DevToolLoadingStateMenu", DevToolLoadingStateMenu)
  .component("DevToolCheckboxes", DevToolCheckboxes)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .mount("#app");
