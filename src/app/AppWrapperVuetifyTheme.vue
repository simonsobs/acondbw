<template>
  <app v-if="!waiting"> </app>
</template>

<script lang="ts">
// Use Options API to set Vuetify theme in Vuetify 2 because not clear how to
// access $vuetify in Composition API.
import { defineComponent } from "vue";
import { mapState } from "pinia";

import { useConfigStore } from "@/stores/config";

import App from "./App.vue";

export default defineComponent({
  components: { App },
  data() {
    return {
      waiting: true,
    };
  },
  computed: {
    ...mapState(useConfigStore, ["vuetifyTheme"]),
  },
  watch: {
    vuetifyTheme(newTheme) {
      this.waiting = false;
      this.$vuetify.theme.themes.light = {
        ...this.$vuetify.theme.themes.light,
        ...newTheme,
      };
    },
  },
  mounted() {
    // in case waiting is still true
    setTimeout(() => {
      this.waiting = false;
    }, 100);
  },
});
</script>
