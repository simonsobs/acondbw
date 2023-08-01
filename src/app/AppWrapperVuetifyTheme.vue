<template>
  <app> </app>
</template>

<script setup lang="ts">
import { defineComponent, computed } from "vue";

import { useConfigStore } from "@/stores/config";

import App from "./App.vue";

const configStore = useConfigStore();

const vuetifyTheme = computed(() => configStore.vuetifyTheme);

// export default defineComponent({
//   components: { App },
//   setup() {
//     const configStore = useConfigStore();
//     return {
//       vuetifyTheme: computed(() => configStore.vuetifyTheme),
//     };
//   },
//   watch: {
//     vuetifyTheme() {
//       this.setVuetifyTheme();
//     },
//   },
//   beforeMount() {
//     this.setVuetifyTheme();
//   },
//   methods: {
//     setVuetifyTheme() {
//       this.$vuetify.theme.themes.light = {
//         ...this.$vuetify.theme.themes.light,
//         ...this.vuetifyTheme,
//       };
//     },
//   },
// });
</script>
