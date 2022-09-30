import Vue from "vue";
import { PiniaVuePlugin, mapState } from "pinia";
import App from "./app/AppWrapperLoadJson.vue";
import { createRouter } from "./router";
import vuetify from "./plugins/vuetify";
// import InstantSearch from "vue-instantsearch";
import pinia from "@/stores";
import { useConfigStore } from "@/stores/config";
import DevToolLoadingStateMenu from "@/components/utils/DevToolLoadingStateMenu.vue";

// https://github.com/sindresorhus/github-markdown-css
import "../node_modules/github-markdown-css/github-markdown-light.css";

Vue.use(PiniaVuePlugin);
// Vue.use(InstantSearch);

Vue.component("DevToolLoadingStateMenu", DevToolLoadingStateMenu);

Vue.config.productionTip = false;

new Vue({
  router: createRouter(),
  vuetify,
  pinia,
  computed: {
    ...mapState(useConfigStore, ["vuetifyTheme"]),
  },
  watch: {
    vuetifyTheme(newTheme) {
      this.$vuetify.theme.themes.light = {
        ...this.$vuetify.theme.themes.light,
        ...newTheme,
      };
    },
  },
  render: (h) => h(App),
}).$mount("#app");
