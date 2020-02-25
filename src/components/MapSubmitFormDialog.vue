<template>
  <v-row class="ma-2" justify="start">
    <v-dialog v-model="dialog" persistent max-width="600">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" v-on="on">Add</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Add a map</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field label="Name of map" v-model="name" required prepend-icon="map"></v-text-field>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="datePosted"
                  label="Date posted"
                  prepend-icon="event"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="datePosted" no-title scrollable @input="menu = false"></v-date-picker>
            </v-menu>
            <v-text-field label="Mapper" v-model="mapper" prepend-icon="person"></v-text-field>
            <v-textarea
              label="Paths"
              v-model="paths"
              hint="A path per line. e.g., nersc:/go/to/my/maps_v3"
              prepend-icon="mdi-folder-multiple"
            ></v-textarea>
            <v-textarea
              label="Note"
              v-model="note"
              hint="Itemized text. One iterm per line"
              prepend-icon="mdi-file-document-box-outline"
            ></v-textarea>
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
      datePosted: new Date().toISOString().substr(0, 10),
      menu: false,
      mapper: "",
      path: "",
      note: ""
    };
  }
};
</script>
