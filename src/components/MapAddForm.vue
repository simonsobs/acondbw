<template>
  <v-card>
    <v-card-title class="headline">Add a map</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          label="Name of map*"
          v-model="form.name"
          :rules="nameRules"
          required
          prepend-icon="map"
        ></v-text-field>
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
          prepend-icon="mdi-note"
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
      <v-btn color="secondary" text @click="resetForm()">Reset</v-btn>
      <v-btn color="primary" :disabled="!valid" @click="addMap()">Add</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
import ALL_MAPS from "@/graphql/AllMaps.gql";
import MAP_FRAGMENT from "@/graphql/MapFragment.gql";

const formDefault = {
  name: "",
  datePosted: new Date().toISOString().substr(0, 10),
  mapper: "",
  // paths: "",
  note: ""
};

export default {
  name: "MapAddForm",
  data() {
    return {
      form: { ...formDefault },
      valid: true,
      nameRules: [v => !!v || "Name is required"],
      menuDatePosteDatePicker: false
    };
  },
  methods: {
    resetForm() {
      // this.$refs.form.reset();
      // This line is commented out because it resets "form" to
      // the empty object {}.
      // Instead, the following two lines are used.
      this.form = { ...formDefault };
      this.$refs.form.resetValidation();
    },
    async addMap() {
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation($input: CreateMapInput!) {
              createMap(input: $input) {
                ok
                map {
                  ...map
                }
              }
            }
            ${MAP_FRAGMENT}
          `,
          variables: { input: this.form },
          update: (cache, { data: { createMap } }) => {
            const data = cache.readQuery({
              query: ALL_MAPS
            });
            data.allMaps.edges.splice(0, 0, {
              node: createMap.map,
              __typename: "MapEdge"
            });
            cache.writeQuery({
              query: ALL_MAPS,
              data
            });
          }
        });
        this.$emit("finished");
        this.resetForm();
      } catch (error) {
        console.log(error);
      }
      this.$emit("finished");
    }
  }
};
</script>
