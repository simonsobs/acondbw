<template>
  <app> </app>
</template>

<script lang="ts">
// Use Options API to set Vuetify theme in Vuetify 2 because not clear how to
// access $vuetify in Composition API.
import { defineComponent, computed } from "vue";

import { useConfigStore } from "@/stores/config";

import App from "./App.vue";

export default defineComponent({
  components: { App },
  setup() {
    const configStore = useConfigStore();
    return {
      vuetifyTheme: computed(() => configStore.vuetifyTheme),
    };
  },
  watch: {
    vuetifyTheme() {
      this.setVuetifyTheme();
    },
  },
  beforeMount() {
    this.setVuetifyTheme();
  },
  methods: {
    setVuetifyTheme() {
      this.$vuetify.theme.themes.light = {
        ...this.$vuetify.theme.themes.light,
        ...this.vuetifyTheme,
      };
    },
  },
});
</script>
