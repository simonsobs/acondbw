<template>
  <div>
    <navigation v-model="drawer"></navigation>
    <app-bar :order="order">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" v-if="mobile">
        </v-app-bar-nav-icon>
      </template>
    </app-bar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useDisplay } from "vuetify";
import AppBar from "./AppBar.vue";
import Navigation from "./Navigation.vue";

// https://vuetifyjs.com/en/features/display-and-platform/
const display = useDisplay();
const mobile = display.mobile;
const drawer = ref<boolean>(!display.mobile.value);
watchEffect(() => {
  drawer.value = !display.mobile.value;
});

// https://vuetifyjs.com/en/features/application-layout/#dynamic-layouts-and-order
const order = computed(() => (mobile.value ? 0 : -1));
</script>
