<template>
  <div class="product-add-form" style="position: relative;">
    <v-card class="pa-5">
      <v-card-title
        v-if="state == State.LOADED"
        class="headline primary--text"
      >Add {{ productType.indefArticle }} {{ productType.singular }}</v-card-title>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-form v-if="state == State.LOADED" ref="form" v-model="valid">
        <v-card outlined>
          <v-container fluid class="px-0">
            <v-row class="ma-0 px-0">
              <v-col order="1" cols="12" md="4">
                <v-text-field
                  label="Name*"
                  required
                  :hint="'Name of the ' + productType.singular + '. This field cannot be changed later.'"
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
                      :hint="'The date on which the ' + productType.singular + ' was produced, e.g., 2020-05-06. This field cannot be changed later.'"
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
                  :hint="'The person or group that produced the ' + productType.singular + ', e.g. pwg-xxx. This field cannot be changed later.'"
                  persistent-hint
                  v-model="form.producedBy"
                  :rules="requiredRules"
                ></v-text-field>
              </v-col>
              <v-col order="4" cols="6" offset-md="4" md="4">
                <v-text-field
                  label="Contact*"
                  required
                  :hint="'A person or group that can be contacted for questions or issues about the ' + productType.singular + '.'"
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
                  hint="A path per line. e.g., nersc:/go/to/my/product_v3"
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
          <v-btn color="primary" :disabled="!valid" @click="addProduct()">Add</v-btn>
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
          <v-card-title class="success--text">Added</v-card-title>
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
import _ from "lodash";

import PRODUCT_TYPE from "@/graphql/ProductType.gql";
import CREATE_PRODUCT from "@/graphql/CreateProduct.gql";
import ALL_PRODUCTS_BY_TYPE_ID from "@/graphql/AllProductsByTypeId.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/DevToolLoadingStateOverridingMenu";

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
  name: "ProductAddForm",
  components: {
    DevToolLoadingStateOverridingMenu
  },
  props: {
    productTypeId: { required: true }
  },
  data() {
    return {
      productType: null,
      queryError: null,
      devtoolState: null,
      State: State,
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
  computed: {
    state() {
      if (this.devtoolState) {
        return this.devtoolState;
      }

      if (this.loading) {
        return State.LOADING;
      } else if (this.queryError) {
        return State.ERROR;
      } else if (this.productType) {
        return State.LOADED;
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.$apollo.queries.productType.loading;
    }
  },
  apollo: {
    productType: {
      query: PRODUCT_TYPE,
      variables() {
        return { typeId: this.productTypeId };
      },
      skip: function() {
        return !this.productTypeId;
      },
      result(result) {
        this.queryError = result.error ? result.error : null;
      }
    }
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
    async addProduct() {
      try {
        const createProductInput = _.pick(this.form, [
          "name",
          "contact",
          "dateProduced",
          "producedBy",
          "postedBy",
          "note"
        ]);

        createProductInput.typeId = this.productTypeId;

        const paths = this.form.paths
          .split("\n")
          .map(x => x.trim()) // trim e.g., " /a/b/c " => "/a/b/c"
          .filter(Boolean) // remove empty strings
          .filter((v, i, a) => a.indexOf(v) === i); // unique

        createProductInput.paths = paths;

        const data = await this.$apollo.mutate({
          mutation: CREATE_PRODUCT,
          variables: { input: createProductInput },
          update: (cache, { data: { createProduct } }) => {
            const data = cache.readQuery({
              query: ALL_PRODUCTS_BY_TYPE_ID,
              variables: { typeId: this.productTypeId }
            });
            data.allProducts.edges.splice(0, 0, {
              node: createProduct.product,
              __typename: "ProductEdge"
            });
            cache.writeQuery({
              query: ALL_PRODUCTS_BY_TYPE_ID,
              variables: { typeId: this.productTypeId },
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
