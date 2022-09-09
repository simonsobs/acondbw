import Vue from "vue";
import { PiniaVuePlugin, mapState } from "pinia";
import App from "./App.vue";
import { createRouter } from "./router";
import vuetify from "./plugins/vuetify";
import { apolloProvider } from "./vue-apollo";
// import InstantSearch from "vue-instantsearch";
import pinia from "@/stores";
import { useStore } from "@/stores/main";

Vue.use(PiniaVuePlugin);
// Vue.use(InstantSearch);

Vue.config.productionTip = false;

new Vue({
  router: createRouter(),
  vuetify,
  pinia,
  apolloProvider,
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
