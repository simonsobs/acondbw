import Vue from "vue";
import { PiniaVuePlugin, mapState } from "pinia";
import App from "./App.vue";
import { createRouter } from "./router";
import vuetify from "./plugins/vuetify";
// import InstantSearch from "vue-instantsearch";
import pinia from "@/stores";
import { useConfigStore } from "@/stores/config";
import DevToolLoadingStateMenu from "@/components/utils/DevToolLoadingStateMenu.vue";

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
