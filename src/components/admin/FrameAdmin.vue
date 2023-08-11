<template>
  <div>
    <navigation-admin v-model="drawer"></navigation-admin>
    <app-bar @drawer="drawer = !drawer"></app-bar>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useDisplay } from "vuetify";
import AppBar from "@/components/layout/AppBar.vue";
import NavigationAdmin from "./NavigationAdmin.vue";

const display = useDisplay();
const drawer = ref<boolean>(!display.mobile.value);
watchEffect(() => {
  drawer.value = !display.mobile.value;
});
</script>
