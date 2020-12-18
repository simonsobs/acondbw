<template>
  <v-progress-circular
    v-if="loading"
    indeterminate
    :size="18"
    :width="3"
    color="grey"
  ></v-progress-circular>
  <v-card flat v-else>
    <v-card-title>Admin App</v-card-title>
    <v-card-actions>
      <v-btn block outlined @click="requestAuth">
        <v-icon left>mdi-github</v-icon>Store Admin App Token
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { requestAuthForAdminApp } from "@/utils/admin-token.js"

export default {
  name: "AdminAppTokenCard",
  data: () => ({
    loading: false,
  }),
  methods: {
    async requestAuth() {
      this.loading = true;
      try {
        await requestAuthForAdminApp(window, this.$apollo);
      } catch (error) {
        this.$router.push({ name: "AdminAppTokenError" });
        this.loading = false;
      } 
    },
  },
};
</script>
