<template>
  <div class="g-container">
    <v-card flat min-width="250px" variant="flat">
      <v-card-title> Sign In Unsuccessful </v-card-title>
      <v-card-text v-if="error">
        <v-alert type="error" outlined>
          <strong v-if="error.error">{{ error.error }}:</strong>
          <span v-if="error.error_description">
            {{ error.error_description }}
          </span>
          <v-btn
            v-if="error.error_uri"
            icon
            small
            color="error"
            :href="error.error_uri"
            target="_blank"
          >
            <v-icon icon="mdi-open-in-new"></v-icon>
          </v-btn>
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" to="/">Go back</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const { lastError: error } = storeToRefs(authStore);
</script>

<style scoped>
.g-container {
  display: grid;
  height: 100%;
  place-items: center;
}
</style>
