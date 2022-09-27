<template>
  <v-container fill-height fluid style="align-items: stretch">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <div class="text-h3 text-center">
          {{ title }}
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <v-container fill-height fluid>
          <v-row align="center" justify="center">
            <v-col style="flex: 0">
              <sign-in-card></sign-in-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useConfig } from "@/utils/config";

import SignInCard from "@/components/auth/SignInCard.vue";

const config = useConfig();
const title = computed(() => config.config?.value.toolbarTitle || "");
</script>
