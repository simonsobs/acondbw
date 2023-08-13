<template>
  <v-app>
    <app></app>
  </v-app>
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

html,
body,
#app,
.v-application,
.v-application__wrap {
  height: 100%;
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
