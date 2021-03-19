import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { apolloProvider } from "./vue-apollo";
import InstantSearch from 'vue-instantsearch';

Vue.use(InstantSearch);

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
