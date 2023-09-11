<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <div>
        <div class="text-h3 text-center">This is an about page</div>
        <div class="mt-5 text-center">
          <span class="font-italic font-weight-medium">Server version:</span>
          {{ version }}
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useVersionQuery } from "@/graphql/codegen/generated";

const { data } = useVersionQuery();
const version = computed(() => data?.value?.version || "unknown");
</script>
