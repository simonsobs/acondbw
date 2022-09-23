import Vue from "vue";
import { PiniaVuePlugin, mapState } from "pinia";
import App from "./App.vue";
import { createRouter } from "./router";
import vuetify from "./plugins/vuetify";
// import InstantSearch from "vue-instantsearch";
import pinia from "@/stores";
import { useStore } from "@/stores/main";
import DevToolLoadingStateMenu from "@/components/utils/DevToolLoadingStateMenu.vue";

// import scss here because not clear how to do it in vite.config.ts
// https://stackoverflow.com/a/71189478/7309855
// Note: This is not fully working. The Google fonts are imported. But
// $body-font-family is not effective; the font-family is set in App.vue.
import "@/styles/variables.scss";

Vue.use(PiniaVuePlugin);
// Vue.use(InstantSearch);

Vue.component("DevToolLoadingStateMenu", DevToolLoadingStateMenu);

Vue.config.productionTip = false;

new Vue({
  router: createRouter(),
  vuetify,
  pinia,
  computed: {
    ...mapState(useStore, ["vuetifyTheme"]),
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
