<template>
  <div class="sign-out-confirmation" style="position: relative">
    <v-card class="pa-3">
      <v-card-title class="headline">Sign Out</v-card-title>
      <v-card-text class="body-1 font-weight-medium"
        >Really, sign out?</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="text" @click="emit('finished')">
          Cancel
        </v-btn>
        <v-btn color="primary" @click="callSignOut"> Sign Out </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";

interface Emits {
  (event: "finished"): void;
}

const emit = defineEmits<Emits>();

const route = useRoute();
const router = useRouter();

const store = useStore();
const authStore = useAuthStore();

async function callSignOut() {
  await authStore.signOut();
  emit("finished");
  store.setSnackbarMessage("Signed out");

  const to = { name: "Entry" };
  if (route.path == router.resolve(to).path) {
    // to avoid NavigationDuplicated
    return;
  }
  router.push(to);
}
</script>
