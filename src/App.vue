<template>
  <v-app>
    <router-view name="frame"></router-view>
    <v-main>
      <transition :name="transitionName" :mode="transitionMode">
        <keep-alive>
          <router-view :key="route.fullPath"></router-view>
        </keep-alive>
      </transition>
    </v-main>
    <snackbar></snackbar>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router/composables";
import { useStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";
import { createClient, provideClient } from "@urql/vue";
import { apolloClient } from "@/vue-apollo";
import { checkAuthForCurrentRoute } from "@/router";
import Snackbar from "@/components/layout/Snackbar.vue";

export default defineComponent({
  name: "App",
  components: {
    Snackbar,
  },
  setup() {
    const store = useStore();
    const title = computed(() => store.webConfig.headTitle);
    watch(
      title,
      (val) => {
        document.title = val || "loading...";
      },
      { immediate: true }
    );

    const transitionName = ref("fade-app-across");
    const transitionMode = ref("out-in");
    const route = useRoute();
    watch(
      () => route.path,
      (to, from) => {
        // update the transition effect dynamically
        // https://router.vuejs.org/guide/advanced/transitions.html#per-route-transition

        const toDir = to.split("/")[2]; // e.g., "/product/map/abc-def/" -> "map"
        const fromDir = from.split("/")[2];

        if (toDir === fromDir) {
          transitionName.value = "fade-app-within";
          transitionMode.value = "out-in";
        } else {
          transitionName.value = "fade-app-across";
          transitionMode.value = "out-in";
        }
      }
    );

    const httpEndpoint =
      process.env.VUE_APP_GRAPHQL_HTTP || "http://localhost:4000/graphql";
    const client = createClient({
      url: httpEndpoint,
    });
    provideClient(client);

    const authStore = useAuthStore();

    onBeforeMount(async () => {
      await store.loadWebConfig(apolloClient);
      await authStore.checkIfSignedIn(apolloClient);
    });

    const router = useRouter();
    watch(
      () => authStore.isSignedIn,
      async (val) => {
        if (val) return;
        await checkAuthForCurrentRoute(router);
      },
      { immediate: true }
    );

    return {
      transitionName,
      transitionMode,
      route,
    };
  },
});
</script>

<!-- https://github.com/sindresorhus/github-markdown-css -->
<style>
@import "../node_modules/github-markdown-css/github-markdown-light.css";

.capitalize {
  text-transform: capitalize;
}

.condensed-font {
  font-family: "Barlow Condensed", "Barlow", sans-serif;
  /* font-family: "Roboto Condensed", Roboto, sans-serif; */
  /* Google Fonts are imported in src/styles/variables.scss */
}

#app .v-card__title {
  /* #app is to increase CSS specificity */
  word-break: normal;
}

#app .markdown-body pre code {
  background-color: inherit;
}

html,
body,
.v-application,
.v-application--wrap,
.v-main__wrap {
  height: 100%;
}

.v-main {
  height: calc(100% - 48px); /* 48px: the height of the app bar */
}
</style>

<style scoped>
.fade-app-across-enter-active {
  transition: opacity 0.8s;
}

.fade-app-across-leave-active {
  transition: opacity 0s;
}

.fade-app-across-enter,
.fade-app-across-leave-to {
  opacity: 0;
}

.fade-app-within-enter-active,
.fade-app-within-leave-active {
  transition: opacity 0s;
}

.fade-app-within-enter,
.fade-app-within-leave-to {
  opacity: 1;
}
</style>
<!-- The leave active for ".fade-app-across" is set to zero because
sometimes the fade away starts from a wrong image.

For .fade-app-within, the opacity is set to one and the duration is
set to zero for both enter and leave, which is effectively disabling the
transition effects, letting the nested routes handle the transition
effects. -->
