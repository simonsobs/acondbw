<template>
  <div class="g-container">
    <div>
      <div class="text-h3 pa-3">Sign-in required</div>
      <sign-in-card :path="$route.query.path">
        <template v-slot:title> <span></span> </template>
      </sign-in-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import SignInCard from "@/components/auth/SignInCard.vue";

export default defineComponent({
  name: "SignInRequired",
  components: {
    SignInCard,
  },
});
</script>

<style scoped>
.g-container {
  display: grid;
  height: 100%;
  place-items: center;
}
</style>
