<template>
  <v-app>
    <router-view name="navigationDrawer" v-model="drawer"></router-view>
    <router-view name="appBar" v-slot="{ Component }">
      <component :is="Component" :order="order">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="toggleDrawer" v-if="mobile">
          </v-app-bar-nav-icon>
        </template>
      </component>
    </router-view>
    <v-main>
      <router-view v-slot="{ Component, route }">
        <v-fade-transition leave-absolute>
          <component :key="route.path" :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>
    <snackbar></snackbar>
  </v-app>
</template>

<script setup lang="ts">
/**
 * This component provides the layout of the app.
 * The layout consists of the navigation drawer, the app bar, and the main content.
 * The contents are provided by the router.
 */

// <keep-alive> is not used around <component> because it
// doesn't work well with <transition>.
// <keep-alive> doesn't work well with ProductAdd.vue either.

import { useCheckAuth } from "./check-auth";
import { useColorTheme } from "@/utils/color-theme";
import { useSetTitle } from "./set-title";
import { useDrawer } from "./drawer";
import Snackbar from "@/components/layout/Snackbar.vue";

useCheckAuth();
useColorTheme();
useSetTitle();
const { drawer, toggleDrawer, order, mobile } = useDrawer();
</script>

<style>
.v-main {
  height: calc(100% - var(--v-layout-top));
  /* --v-layout-top is the height of the app bar */
  overflow-y: scroll;
}
</style>
