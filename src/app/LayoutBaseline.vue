<template>
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
      <keep-alive>
        <component :key="route.path" :is="Component" />
      </keep-alive>
    </router-view>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useDisplay } from "vuetify";

// https://vuetifyjs.com/en/features/display-and-platform/
const { mobile } = useDisplay();

const drawer = ref<boolean>(false);
watchEffect(() => {
  drawer.value = !mobile.value;
});

function toggleDrawer() {
  drawer.value = !drawer.value;
}

// https://vuetifyjs.com/en/features/application-layout/#dynamic-layouts-and-order
const order = computed(() => (mobile.value ? 0 : -1));
</script>

<style>
.v-main {
  height: calc(100% - 64px); /* 64px: the height of the app bar */
  overflow-y: scroll;
}

/* v-main__wrap probably doesn't exit in Vuetify 3 */
.v-main__wrap {
  height: 100%;
}
</style>
