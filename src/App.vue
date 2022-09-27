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

<script setup lang="ts">
import { ref, watch, watchEffect, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router/composables";
import { storeToRefs } from "pinia";
import { provideClient } from "@urql/vue";

import { useAuthStore } from "@/stores/auth";
import { client } from "@/plugins/urql";
import { checkAuthForCurrentRoute } from "@/router";

import { provideConfig } from "@/utils/config";

import Snackbar from "@/components/layout/Snackbar.vue";

const urqlClient = ref(client);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const config = provideConfig(urqlClient);
watchEffect(() => {
  document.title = config.config.value.headTitle || "loading...";
});

provideClient(urqlClient);

onBeforeMount(async () => {
  await authStore.checkIfSignedIn(urqlClient.value);
});

const { isSignedIn } = storeToRefs(authStore);
watchEffect(async () => {
  if (isSignedIn.value) return;
  await checkAuthForCurrentRoute(router);
});

const transitionName = ref("fade-app-across");
const transitionMode = ref("out-in");
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
