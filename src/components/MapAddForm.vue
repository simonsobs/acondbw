<template>
  <v-card style="max-width: 980px;">
    <v-card-title class="headline primary--text">Add a map</v-card-title>
    <v-form ref="form" v-model="valid">
      <v-container fluid class="pa-0">
        <v-row class="ma-0 px-0">
          <v-col order="1" cols="12" md="4" class="py-0">
            <v-text-field
              label="Name*"
              hint="Name of map*"
              persistent-hint
              v-model="form.name"
              :rules="nameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col order="3" cols="6" md="4" class="py-0">
            <v-menu
              v-model="menuDatePosteDatePicker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field v-model="form.datePosted" label="Date posted" v-on="on"></v-text-field>
              </template>
              <v-date-picker
                v-model="form.datePosted"
                no-title
                scrollable
                @input="menuDatePosteDatePicker = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col order="4" cols="6" md="4" class="py-0">
            <v-text-field label="Mapper" v-model="form.mapper"></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mx-0 mb-3 px-0">
          <!-- <v-col cols="12" md="8" offset-md="4" class="py-0">
            <v-textarea
              label="Paths"
              v-model="form.paths"
              persistent-hint
              hint="A path per line. e.g., nersc:/go/to/my/maps_v3"
            ></v-textarea>
          </v-col> -->
          <v-col cols="12" md="8" offset-md="4" class="py-0">
            <v-textarea
              label="Note"
              v-model="form.note"
              hint="will be parsed as Markdown"
              persistent-hint
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
        <v-btn color="secondary" text @click="resetForm()">Reset</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="addMap()">Add</v-btn>
      </v-card-actions>
    </v-form>
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
      nameRules: [
        v => !!v || "Name is required",
        v => (v || "").indexOf(" ") < 0 || "No spaces are allowed"
      ],
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
