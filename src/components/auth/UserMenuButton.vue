<template>
  <span>
    <span v-if="user">
      <v-menu bottom offset-y v-model="menu">
        <template v-slot:activator="{ props }">
          <v-btn icon class="no-uppercase" v-bind="props">
            <v-avatar size="36px">
              <v-img :src="user.avatarUrl"></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            :title="user.name"
            :subtitle="user.login"
            append-icon="mdi-github"
          >
          </v-list-item>
          <v-divider></v-divider>
          <template v-if="isAdmin">
            <v-list-item
              :to="{ name: 'Admin' }"
              prepend-icon="mdi-cog"
              title="Admin"
            >
            </v-list-item>
            <v-divider></v-divider>
          </template>
          <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-logout"
                title="Sign Out"
              >
              </v-list-item>
            </template>
            <sign-out-confirmation
              v-on:finished="
                dialog = false;
                menu = false;
              "
            ></sign-out-confirmation>
          </v-dialog>
        </v-list>
      </v-menu>
    </span>
    <v-btn v-else depressed :to="pathToSignIn">
      <v-icon icon="mdi-github"></v-icon>
      Sign In
    </v-btn>
  </span>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";

import SignOutConfirmation from "./SignOutConfirmation.vue";

const menu = ref(false);
const dialog = ref(false);

const router = useRouter();

const pathToSignIn = computed(() => {
  return router.resolve({ name: "SignIn" }).path;
  // i.e., "/signin"
});

const { gitHubViewer: user, isAdmin } = storeToRefs(useAuthStore());
</script>

<style scoped>
.no-uppercase {
  text-transform: none;
}
</style>
