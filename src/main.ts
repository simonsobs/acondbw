import Vue from "vue";
import { PiniaVuePlugin, mapState, mapActions } from "pinia";
import App from "./App.vue";
import { router, checkAuthForCurrentRoute } from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { apolloProvider } from "./vue-apollo";
import Vuelidate from "vuelidate";
// import InstantSearch from "vue-instantsearch";
import pinia from "@/stores";
import { useStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";

Vue.use(PiniaVuePlugin);
Vue.use(Vuelidate);
// Vue.use(InstantSearch);

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  pinia,
  store,
  apolloProvider,
  created() {
    this.loadWebConfig(this.$apollo);
    this.checkIfSignedIn(this.$apollo);
  },
  computed: {
    ...mapState(useAuthStore, ["isSignedIn"]),
  },
  watch: {
    isSignedIn: {
      immediate: true,
      handler: function (val) {
        if (!val) {
          checkAuthForCurrentRoute();
        }
      },
    },
  },
  methods: {
    ...mapActions(useStore, ["loadWebConfig"]),
    ...mapActions(useAuthStore, ["checkIfSignedIn"]),
  },
  render: (h) => h(App),
}).$mount("#app");
