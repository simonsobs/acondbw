<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-card flat min-width="250px">
        <v-card-title>Admin App Unsuccessful</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined :to="{ name: 'AdminAppToken' }">Try again</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AdminAppTokenError",
};
</script>
