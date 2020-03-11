<template>
  <v-card>
    <v-card-title class="headline">Add a map</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field label="Name of map" v-model="form.name" required prepend-icon="map"></v-text-field>
        <v-menu
          v-model="menuDatePosteDatePicker"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="form.datePosted"
              label="Date posted"
              prepend-icon="event"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="form.datePosted"
            no-title
            scrollable
            @input="menuDatePosteDatePicker = false"
          ></v-date-picker>
        </v-menu>
        <v-text-field label="Mapper" v-model="form.mapper" prepend-icon="person"></v-text-field>
        <!-- 
            <v-textarea
              label="Paths"
              v-model="form.paths"
              hint="A path per line. e.g., nersc:/go/to/my/maps_v3"
              prepend-icon="mdi-folder-multiple"
            ></v-textarea>
        -->
        <v-textarea
          label="Note"
          v-model="form.note"
          hint="Itemized text. One iterm per line"
          prepend-icon="mdi-file-document-box-outline"
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
      <v-btn color="primary" @click="addMap()">Add</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "mapSubmitFormDialog",
  data() {
    return {
      menuDatePosteDatePicker: false,
      form: {
        name: "",
        datePosted: new Date().toISOString().substr(0, 10),
        mapper: "",
        // paths: "",
        note: ""
      }
    };
  },
  methods: {
    clearForm() {
      this.form = {
        name: "",
        datePosted: new Date().toISOString().substr(0, 10),
        mapper: "",
        // paths: "",
        note: ""
      };
    },
    async addMap() {
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation($input: CreateMapInput!) {
              createMap(input: $input) {
                ok
                map {
                  mapId
                  name
                }
              }
            }
          `,
          variables: { input: this.form }
        });
        this.$emit("finished");
        this.clearForm();
      } catch (error) {
        console.log(error);
      }
      this.$emit("finished");
    }
  }
};
</script>
