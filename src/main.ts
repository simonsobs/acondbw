import Vue from "vue";
import App from "./App.vue";
import { router, checkAuthForCurrentRoute } from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { apolloProvider } from "./vue-apollo";
import Vuelidate from "vuelidate";
// import InstantSearch from "vue-instantsearch";

Vue.use(Vuelidate);
// Vue.use(InstantSearch);

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  apolloProvider,
  created() {
    this.$store.dispatch("initWithAsyncActions", this.$apollo);
  },
  computed: {
    isSignedIn() {
      return this.$store.state.auth.isSignedIn;
    },
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
  render: (h) => h(App),
}).$mount("#app");
