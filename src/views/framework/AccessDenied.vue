<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col class="text-h3 text-center">
        <div>Access Denied</div>
        <v-btn class="mt-5" outlined to="/">Go to the entry page</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AccessDenied",
  data() {
    return {};
  },
};
</script>
