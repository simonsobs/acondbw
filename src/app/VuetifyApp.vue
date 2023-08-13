<template>
  <app> </app>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import { useTheme } from "vuetify";

import { useConfigStore } from "@/stores/config";
import { generateLightAndDarkThemesFromSourceColor } from "@/utils/material-color";

import App from "./App.vue";

const configStore = useConfigStore();

const sourceColor = computed(
  () => configStore.config.materialDynamicColorSource
);

const theme = useTheme();

onBeforeMount(() => {
  setVuetifyTheme();
});

function setVuetifyTheme() {
  const [dynamicLight, dynamicDark] = generateLightAndDarkThemesFromSourceColor(
    sourceColor.value
  );
  // @ts-ignore
  theme.themes.value.light.colors = dynamicLight.colors;
  // @ts-ignore
  theme.themes.value.dark.colors = dynamicDark.colors;
}
</script>
