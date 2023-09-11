<template>
  <v-app-bar comment="fallthrough attributes in use">
    <template v-slot:prepend>
      <slot name="prepend" comment="slot for v-app-bar-nav-icon"> </slot>
    </template>
    <template v-slot:title>
      <router-link
        :to="{ name: 'Entry' }"
        v-text="title"
        class="text-primary font-weight-medium text-decoration-none"
      >
      </router-link>
    </template>
    <search-window class="d-none d-sm-inline"></search-window>
    <v-spacer></v-spacer>
    <template v-slot:append>
      <user-menu-button></user-menu-button>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useConfigStore } from "@/plugins/pinia/stores/config";

import SearchWindow from "@/components/utils/SearchWindow.vue";
import UserMenuButton from "@/components/auth/UserMenuButton.vue";

const configStore = useConfigStore();
const title = computed(() => configStore.config.toolbarTitle || "");
</script>
