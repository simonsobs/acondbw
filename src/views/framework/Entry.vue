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

<script lang="ts">
import Vue from "vue";
import { mapState } from "pinia";
import { useStore } from "@/stores/main";

import SignInCard from "@/components/auth/SignInCard.vue";
import Dashboard from "@/components/product/Dashboard.vue";

export default Vue.extend({
  name: "Home",
  components: {
    SignInCard,
    Dashboard,
  },
  computed: {
    title() {
      return this.webConfig.toolbarTitle || "";
    },
    ...mapState(useStore, ["webConfig"]),
  },
});
</script>
