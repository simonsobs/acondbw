<template>
  <v-app-bar density="default" :order="order">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="$emit('drawer')" v-if="mobile">
      </v-app-bar-nav-icon>
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
import { useDisplay } from "vuetify";
import { useConfigStore } from "@/stores/config";

import SearchWindow from "@/components/utils/SearchWindow.vue";
import UserMenuButton from "@/components/auth/UserMenuButton.vue";

// https://vuetifyjs.com/en/features/application-layout/#dynamic-layouts-and-order
const display = useDisplay();
const mobile = display.mobile;
const order = computed(() => (mobile.value ? 0 : -1));

const configStore = useConfigStore();
const title = computed(() => configStore.config.toolbarTitle || "");
</script>
