<template>
  <v-row class="ma-2" justify="left">
    <v-dialog v-model="dialog" persistent max-width="600">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" v-on="on">Add</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Add a map</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field label="Name" v-model="name" required></v-text-field>
            <v-text-field label="Mapper" v-model="mapper"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="dialog = false">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "mapSubmitFormDialog",
  data() {
    return {
      dialog: false,
      name: "",
      mapper: ""
    };
  }
};
</script>
