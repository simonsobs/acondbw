<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ on }">
      <v-btn outlined v-on="on">Sign In</v-btn>
    </template>
    <v-card>
      <v-card-title>Sign In</v-card-title>
      <v-card-actions>
        <v-btn block outlined>
          <v-icon left>mdi-github</v-icon>Sign In with GitHub
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="dialog=false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SignIn",
  data: () => ({
    dialog: false
  })
};
</script>
