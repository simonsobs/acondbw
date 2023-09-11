<template>
  <v-navigation-drawer comment="fallthrough attributes in use">
    <v-list class="ma-2">
      <v-list-item
        v-for="(link, index) in links"
        :key="index"
        :to="link.to"
        :prepend-icon="link.icon"
        color="primary"
        rounded="lg"
      >
        <v-list-item-title
          v-text="link.title"
          class="capitalize condensed-font"
        ></v-list-item-title>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="ma-4 d-flex justify-space-around align-center">
        <toggle-dark-mode-button></toggle-dark-mode-button>
        <span class="text-secondary text-body-2">v{{ appVersion }}</span>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useStore } from "@/plugins/pinia/stores/main";
import ToggleDarkModeButton from "@/components/utils/ToggleDarkModeButton.vue";

const store = useStore();
const { appVersion } = store;

const links = reactive([
  {
    title: "versions",
    to: { name: "AdminVersion" },
    icon: "mdi-scatter-plot-outline",
  },
  {
    title: "log",
    to: { name: "AdminLog" },
    icon: "mdi-exclamation-thick",
  },
  {
    title: "config",
    to: { name: "AdminConfig" },
    icon: "mdi-cog",
  },
  {
    title: "theme",
    to: { name: "AdminTheme" },
    icon: "mdi-format-color-fill",
  },
  {
    title: "users",
    to: { name: "AdminUser" },
    icon: "mdi-account-multiple",
  },
  {
    title: "product types",
    to: { name: "ProductType" },
    icon: "mdi-shape",
  },
]);
</script>
