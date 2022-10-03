import Vue from "vue";

import vuetify from "./plugins/vuetify";
import pinia from "@/stores";
import { createRouter } from "@/router";

// import InstantSearch from "vue-instantsearch";

import App from "./app/AppWrapperLoadPreConfig.vue";
import DevToolLoadingStateMenu from "@/components/utils/DevToolLoadingStateMenu.vue";

// https://github.com/sindresorhus/github-markdown-css
import "../node_modules/github-markdown-css/github-markdown-light.css";

// Vue.use(InstantSearch);

Vue.component("DevToolLoadingStateMenu", DevToolLoadingStateMenu);

Vue.config.productionTip = false;

new Vue({
  router: createRouter(),
  vuetify,
  pinia,
  render: (h) => h(App),
}).$mount("#app");
