import { createApp, h } from "vue";

import pinia from "@/stores";
import { createRouter_ } from "@/router";
import vuetify from "@/plugins/vuetify";
import App from "@/app/AppWrapperLoadPreConfig.vue";
import DevToolLoadingStateMenu from "@/components/utils/DevToolLoadingStateMenu.vue";

// https://github.com/sindresorhus/github-markdown-css
import "../node_modules/github-markdown-css/github-markdown-light.css";

const router = createRouter_();

const app = createApp({
  render: () => h(App),
});
app.component("DevToolLoadingStateMenu", DevToolLoadingStateMenu);
app.use(pinia);
app.use(router);
app.use(vuetify);
app.mount("#app");
