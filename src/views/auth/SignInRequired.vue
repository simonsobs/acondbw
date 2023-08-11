<template>
  <div class="g-container">
    <sign-in-card :path="path" v-if="path">
      <template v-slot:title>
        <span class="text-h3 pa-3">Sign-in required</span>
      </template>
    </sign-in-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import SignInCard from "@/components/auth/SignInCard.vue";

const router = useRouter();
const path = computed(() => router.currentRoute.value.query.path as string);
</script>

<style scoped>
.g-container {
  display: grid;
  height: 100%;
  place-items: center;
}
</style>
