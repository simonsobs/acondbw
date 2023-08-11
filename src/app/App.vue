<template>
  <v-app>
    <router-view name="frame"></router-view>
    <v-main>
      <router-view :key="route.path" v-slot="{ Component }">
        <transition :name="transitionName" :mode="transitionMode">
          <keep-alive>
            <component :key="route.path" :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </v-main>
    <snackbar></snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";

import { useConfigStore } from "@/stores/config";

import Snackbar from "@/components/layout/Snackbar.vue";

const route = useRoute();
const configStore = useConfigStore();

watchEffect(() => {
  document.title = configStore.config.headTitle || "loading...";
});

const transitionName = ref("fade-app-across");
const transitionMode = ref<"out-in">("out-in");
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

<style>
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
#app,
.v-application,
.v-application__wrap,
.v-main__wrap {
  height: 100%;
}

.v-main {
  height: calc(100% - 64px); /* 64px: the height of the app bar */
  overflow-y: scroll;
}

.v-btn {
  text-transform: capitalize;
}

.v-card--variant-outlined {
  background: rgb(var(--v-theme-surface-container-lowest));
  border: thin solid rgb(var(--v-theme-outline-variant));
}

.v-card--variant-elevated {
  background: rgb(var(--v-theme-surface-container-lowest));
}

.v-autocomplete .v-field__overlay {
  background-color: rgb(var(--v-theme-surface-container-lowest));
}

.v-table {
  background: rgb(var(--v-theme-surface-container-lowest));
  border: 1px solid rgb(var(--v-theme-outline-variant));
  border-radius: 8px;
}
.v-table__wrapper > table > thead > tr th,
.v-table__wrapper > table tbody > tr > td {
  background-color: inherit;
}
.v-data-table .v-table__wrapper > table > thead > tr th,
.v-data-table .v-table__wrapper > table tbody > tr > td {
  background-color: inherit; 
}
</style>
