<template>
  <v-card class="pa-5">
    <v-card-title class="headline primary--text">Add a map</v-card-title>
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <v-form ref="form" v-model="valid">
      <v-card outlined>
        <v-container fluid class="px-0">
          <v-row class="ma-0 px-0">
            <v-col order="1" cols="12" md="4">
              <v-text-field
                label="Name*"
                required
                hint="Name of the map. This field cannot be changed later."
                persistent-hint
                v-model="form.name"
                :rules="nameRules"
              ></v-text-field>
            </v-col>
            <v-col order="3" cols="6" md="4">
              <v-menu
                v-model="menuDateProducedDatePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Date produced (YYYY-MM-DD)*"
                    required
                    hint="The date on which the map was produced, e.g., 2020-05-06. This field cannot be changed later."
                    persistent-hint
                    v-model="form.dateProduced"
                    :rules="requiredRules"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.dateProduced"
                  no-title
                  scrollable
                  @input="menuDateProducedDatePicker = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col order="4" cols="6" md="4">
              <v-text-field
                label="Produced by*"
                required
                hint="The person or group that produced the map, e.g. pwg-xxx. This field cannot be changed later."
                persistent-hint
                v-model="form.producedBy"
                :rules="requiredRules"
              ></v-text-field>
            </v-col>
            <v-col order="4" cols="6" offset-md="4" md="4">
              <v-text-field
                label="Contact*"
                required
                hint="A person or group that can be contacted for questions or issues about the map."
                persistent-hint
                v-model="form.contact"
                :rules="requiredRules"
              ></v-text-field>
            </v-col>
            <v-col order="4" cols="6" md="4">
              <v-text-field
                label="Posted by*"
                required
                hint="The person who is filling out this form. This field cannot be changed later."
                persistent-hint
                v-model="form.postedBy"
                :rules="requiredRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mx-0 mb-3 px-0">
            <v-col cols="12" md="8" offset-md="4">
              <v-textarea
                label="Paths"
                hint="A path per line. e.g., nersc:/go/to/my/maps_v3"
                rows="2"
                persistent-hint
                v-model="form.paths"
              ></v-textarea>
            </v-col>
            <v-col cols="12" md="8" offset-md="4">
              <v-textarea
                label="Note"
                hint="will be parsed as Markdown"
                persistent-hint
                rows="3"
                v-model="form.note"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card-text></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
        <v-btn color="secondary" text @click="resetForm()">Reset</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="addMap()">Add</v-btn>
      </v-card-actions>
    </v-form>
    <v-dialog v-model="dialogSuccess" max-width="500px">
      <v-card>
        <v-card-title class="success--text">Added</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialogSuccess()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import _ from "lodash";

import CREATE_MAP from "@/graphql/CreateMap.gql";
import CREATE_MAP_FILE_PATH from "@/graphql/CreateMapFilePath.gql";
import ALL_MAPS from "@/graphql/AllMaps.gql";
import MAP from "@/graphql/Map.gql";

const formDefault = {
  name: "",
  contact: "",
  dateProduced: new Date().toISOString().substr(0, 10),
  producedBy: "",
  postedBy: "",
  paths: "",
  note: ""
};

export default {
  name: "MapAddForm",
  data() {
    return {
      form: { ...formDefault },
      valid: true,
      error: null,
      dialogSuccess: false,
      nameRules: [
        v => !!v || "This field is required",
        v => (v || "").indexOf(" ") < 0 || "No spaces are allowed"
      ],
      requiredRules: [v => !!v || "This field is required"],
      menuDateProducedDatePicker: false
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
      this.error = null;
    },
    async addMap() {
      try {
        const createMapInput = _.pick(this.form, [
          "name",
          "contact",
          "dateProduced",
          "producedBy",
          "postedBy",
          "note"
        ]);

        const paths = this.form.paths
          .split("\n")
          .map(x => x.trim()) // trim e.g., " /a/b/c " => "/a/b/c"
          .filter(Boolean) // remove empty strings
          .filter((v, i, a) => a.indexOf(v) === i); // unique

        createMapInput.paths = paths;

        const data = await this.$apollo.mutate({
          mutation: CREATE_MAP,
          variables: { input: createMapInput },
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
        this.dialogSuccess = true;
      } catch (error) {
        this.error = error;
      }
    },
    closeDialogSuccess() {
      this.dialogSuccess = false;
      this.resetForm();
      this.$emit("finished");
    }
  }
};
</script>
