import { createApp, h } from "vue";

import pinia from "@/stores";
import { createRouter_ } from "@/router";
import vuetify from "@/plugins/vuetify";
import App from "@/app/AppWrapperLoadPreConfig.vue";
import DevToolLoadingStateMenu from "@/components/utils/DevToolLoadingStateMenu.vue";

// github-markdown-css:  https://github.com/sindresorhus/github-markdown-css

// light
import "../node_modules/github-markdown-css/github-markdown-light.css";

// dark
// import "../node_modules/github-markdown-css/github-markdown-dark.css";

// light or dark from OS setting
// import "../node_modules/github-markdown-css/github-markdown.css";

const router = createRouter_();

const app = createApp({
  render: () => h(App),
});
app.component("DevToolLoadingStateMenu", DevToolLoadingStateMenu);
app.use(pinia);
app.use(router);
app.use(vuetify);
app.mount("#app");
