<template>
  <app> </app>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import { useTheme } from "vuetify";

import { useConfigStore } from "@/stores/config";

import App from "./App.vue";

const configStore = useConfigStore();

const vuetifyTheme = computed(() => configStore.vuetifyTheme);

const theme = useTheme();

onBeforeMount(() => {
  setVuetifyTheme();
});

function setVuetifyTheme() {
  theme.themes.value.light.colors = {
    ...theme.themes.value.light.colors,
    ...vuetifyTheme.value,
  };
}
</script>
