<template>
  <div>
    <navigation v-model="drawer"></navigation>
    <app-bar @drawer="drawer = !drawer"></app-bar>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useDisplay } from "vuetify";
import AppBar from "./AppBar.vue";
import Navigation from "./Navigation.vue";

// https://vuetifyjs.com/en/features/display-and-platform/
const display = useDisplay();
const drawer = ref<boolean>(!display.mobile.value);
watchEffect(() => {
  drawer.value = !display.mobile.value;
});
</script>
