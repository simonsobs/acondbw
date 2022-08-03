<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <admin-app-token-card></admin-app-token-card>
    </v-row>
  </v-container>
</template>

<script>
import AdminAppTokenCard from "@/components/admin-token/AdminAppTokenCard.vue";

export default {
  name: "AdminAppToken",
  components: {
    AdminAppTokenCard,
  },
  data: () => ({}),
};
</script>
