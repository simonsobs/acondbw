import { createApp, h } from "vue";

import pinia from "@/stores";
import { createRouter_ } from "@/router";
import vuetify from "@/plugins/vuetify";
import App from "@/app/App.vue";
import DevToolLoadingStateMenu from "@/components/utils/DevToolLoadingStateMenu.vue";

const router = createRouter_();

const app = createApp({
  render: () => h(App),
});
app.component("DevToolLoadingStateMenu", DevToolLoadingStateMenu);
app.use(pinia);
app.use(router);
app.use(vuetify);
app.mount("#app");
