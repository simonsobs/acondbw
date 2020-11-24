import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { createProvider, AUTH_TOKEN } from "./vue-apollo";
import { setContext } from "apollo-link-context";

Vue.config.productionTip = false;

// copied from https://blog.logrocket.com/handling-authentication-in-your-graphql-powered-vue-app/
const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = JSON.parse(localStorage.getItem(AUTH_TOKEN));
  // const token = localStorage.getItem(AUTH_TOKEN);
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token || "",
    },
  };
});

// After the updgrades of node packages at the commit https://github.com/simonsobs/acondbw/commit/96cca659b9eda45816bfc8891fc76e4754313131,
// "Authorization" is automatically included without authLink.
// const options = { link: authLink };
const options = { };

new Vue({
  router,
  vuetify,
  store,
  apolloProvider: createProvider(options),
  render: (h) => h(App),
}).$mount("#app");
