<template>
  <div class="map-edit-form" style="position: relative;">
    <v-card class="pa-5">
      <v-card-title class="headline primary--text">Update the information about the map</v-card-title>
      <v-card-text>This form is for updating the information about the map. If the map itself has been updated, a new entry should be added.</v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-form v-if="state == State.LOADED" ref="form" v-model="valid">
        <v-card outlined>
          <v-container fluid class="px-0">
            <v-row class="ma-0 px-0">
              <v-col order="1" cols="12" md="4">
                <v-text-field
                  label="Name"
                  readonly
                  hint="Name of the map. This field cannot be changed."
                  persistent-hint
                  v-model="node.name"
                ></v-text-field>
              </v-col>
              <v-col order="4" cols="6" md="4">
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
                  label="Updated by*"
                  required
                  hint="The person who is filling out this form."
                  persistent-hint
                  v-model="form.updatedBy"
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
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
          <v-btn color="secondary" text @click="resetForm()">Reset</v-btn>
          <v-btn color="primary" :disabled="!(valid && changed)" @click="editMap()">Update</v-btn>
        </v-card-actions>
      </v-form>
      <div v-else>
        <v-card outlined>
          <div v-if="state == State.LOADING" class="mx-4 py-2">
            <v-progress-circular indeterminate :size="18" :width="3" color="grey"></v-progress-circular>
          </div>
          <v-card-text v-else-if="state == State.ERROR">Error: cannot load data</v-card-text>
          <v-card-text v-else>Nothing to show here.</v-card-text>
        </v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="$emit('finished')">Close</v-btn>
        </v-card-actions>
      </div>
      <v-dialog v-model="dialogSuccess" max-width="500px">
        <v-card>
          <v-card-title class="success--text">Updated</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialogSuccess()">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <DevToolLoadingStateOverridingMenu @state="devtoolState = $event"></DevToolLoadingStateOverridingMenu>
  </div>
</template>

<script>
import gql from "graphql-tag";
import MAP from "@/graphql/Map.gql";
import ALL_MAPS from "@/graphql/AllMaps.gql";
import MAP_FRAGMENT from "@/graphql/MapFragment.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/DevToolLoadingStateOverridingMenu";

export default {
  name: "MapEditForm",
  components: {
    DevToolLoadingStateOverridingMenu
  },
  props: {
    productId: { default: null } // map.productId not map.id
  },
  data() {
    return {
      node: null,
      form: null,
      valid: true,
      error: null,
      dialogSuccess: false,
      requiredRules: [v => !!v || "This field is required"],
      devtoolState: null,
      State: State
    };
  },
  computed: {
    changed() {
      return !(JSON.stringify(this.form) === JSON.stringify(this.formDefault))
    },
    state() {
      if (this.devtoolState) {
        return this.devtoolState;
      }

      if (this.loading) {
        return State.LOADING;
      } else if (this.error) {
        return State.ERROR;
      } else if (this.form) {
        return State.LOADED;
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.$apollo.queries.node.loading;
    },
    formDefault() {
      if (this.node) {
        const ret = (({ name, contact, updatedBy, note }) => ({
          name,
          contact,
          updatedBy,
          note
        }))(this.node);
        ret.paths = this.node.paths.edges
          .map(e => e.node.path)
          .join("\n");
        return ret;
      } else {
        return null;
      }
    }
  },
  watch: {
    formDefault: function() {
      this.form = { ...this.formDefault };
      console.log(this.form);
    }
  },
  apollo: {
    node: {
      query: MAP,
      variables() {
        return {
          productId: this.productId
        };
      },
      update: data => data.map,
      result(result) {
        this.error = null;
        if (result.error) {
          this.error = true;
        }
      }
    }
  },
  methods: {
    resetForm() {
      // this.$refs.form.reset();
      // This line is commented out because it resets "form" to
      // the empty object {}.
      // Instead, the following two lines are used.
      this.form = { ...this.formDefault };
      this.$refs.form.resetValidation();
      this.error = null;
    },
    async editMap() {
      try {
        const updateMapInput = (({ contact, updatedBy, note }) => ({
          contact,
          updatedBy,
          note
        }))(this.form);
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation($productId: Int!, $input: UpdateMapInput!) {
              updateMap(productId: $productId, input: $input) {
                ok
                map {
                  ...mapFragment
                }
              }
            }
            ${MAP_FRAGMENT}
          `,
          variables: { productId: this.node.productId, input: updateMapInput }
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
