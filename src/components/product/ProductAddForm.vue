<template>
  <div class="product-add-form" style="position: relative;">
    <v-container>
      <v-card outlined max-width="980px" class="mx-auto my-5">
        <v-card-title
          v-if="state == State.LOADED"
          class="headline primary--text"
        >Add {{ productType.indefArticle }} {{ productType.singular }}</v-card-title>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <v-form v-if="state == State.LOADED" ref="form" v-model="valid">
          <v-divider></v-divider>
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
                <v-text-field-with-date-picker
                  label="Date produced (YYYY-MM-DD)*"
                  :hint="'The date on which the ' + productType.singular + ' was produced, e.g., 2020-05-06. This field cannot be changed later.'"
                  v-model="form.dateProduced"
                  :rules="requiredRules"
                ></v-text-field-with-date-picker>
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
            </v-row>
            <v-row class="mx-0 mb-3 px-0">
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
            <v-divider></v-divider>
            <v-row justify="end" class="mx-2 mb-3 px-0">
              <v-card-text>Relations to other products</v-card-text>
              <form-relations :relations="form.relations"></form-relations>
            </v-row>
            <v-divider></v-divider>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="close()">Cancel</v-btn>
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
            <v-btn color="secondary" text @click="close()">Close</v-btn>
          </v-card-actions>
        </div>
      </v-card>
      <dev-tool-loading-state-overriding-menu @state="devtoolState = $event"></dev-tool-loading-state-overriding-menu>
    </v-container>
  </div>
</template>
  
<script>
import _ from "lodash";

import QueryForProductAddForm from "@/graphql/queries/QueryForProductAddForm.gql";
import PRODUCT_TYPE from "@/graphql/queries/ProductType.gql";
import CREATE_PRODUCT from "@/graphql/mutations/CreateProduct.gql";
import ALL_PRODUCTS_BY_TYPE_ID from "@/graphql/queries/AllProductsByTypeId.gql";

import VTextFieldWithDatePicker from "@/components/utils/VTextFieldWithDatePicker";
import FormRelations from "./FormRelations";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu";

const formRelationDefault = {
  typeId: null,
  productTypeId: null,
  productId: null
};

const formDefault = {
  name: "",
  contact: "",
  dateProduced: new Date().toISOString().substr(0, 10),
  producedBy: "",
  paths: "",
  relations: [{ ...formRelationDefault }, { ...formRelationDefault }],
  note: ""
};

export default {
  name: "ProductAddForm",
  components: {
    VTextFieldWithDatePicker,
    FormRelations,
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
      step: 1,
      form: _.cloneDeep(formDefault),
      valid: true,
      error: null,
      nameRules: [
        v => !!v || "This field is required",
        v => (v || "").indexOf(" ") < 0 || "No spaces are allowed"
      ],
      requiredRules: [v => !!v || "This field is required"]
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
      query: QueryForProductAddForm,
      variables() {
        return { typeId: this.productTypeId };
      },
      skip: function() {
        return !this.productTypeId;
      },
      result(result) {
        this.queryError = result.error ? result.error : null;

        if (this.queryError) {
          return;
        }

        this.productType = result.data.productType;
      }
    }
  },
  methods: {
    scrollToTop() {
      const element = document.getElementsByClassName("v-dialog--active")[0];
      if (element) {
        element.scrollTop = 0;
      }
    },
    close() {
      this.scrollToTop();
      this.$emit("finished");
    },
    resetForm() {
      // this.$refs.form.reset();
      // This line is commented out because it resets "form" to
      // the empty object {}.
      // Instead, the following two lines are used.
      this.form = _.cloneDeep(formDefault);
      this.$refs.form.resetValidation();
      this.error = null;
      this.scrollToTop();
    },
    async addProduct() {
      try {
        const createProductInput = _.pick(this.form, [
          "name",
          "contact",
          "dateProduced",
          "producedBy",
          "note"
        ]);

        createProductInput.typeId = this.productTypeId;

        const paths = this.form.paths
          .split("\n")
          .map(x => x.trim()) // trim e.g., " /a/b/c " => "/a/b/c"
          .filter(Boolean) // remove empty strings
          .filter((v, i, a) => a.indexOf(v) === i); // unique

        createProductInput.paths = paths;

        createProductInput.relations = _.filter(
          _.map(this.form.relations, x =>
            _.pickBy(_.pick(x, ["typeId", "productId"]), _.identity)
          ),
          x => _.size(x) == 2
        );

        const data = await this.$apollo.mutate({
          mutation: CREATE_PRODUCT,
          variables: { input: createProductInput },
          update: (cache, { data: { createProduct } }) => {
            try {
              // Delete all cache and dispacth "apolloMutationCalled", which triggers refetch
              this.$apollo.provider.defaultClient.cache.data.data = {}

              // The following code was used to update cache, which 
              // is typically a recommended way. But it is commented out
              // because it is not clear how to systematically update 
              // all affected cache.

              // const data = cache.readQuery({
              //   query: ALL_PRODUCTS_BY_TYPE_ID,
              //   variables: { typeId: this.productTypeId }
              // });
              // data.allProducts.edges.splice(0, 0, {
              //   node: createProduct.product,
              //   __typename: "ProductEdge"
              // });
              // cache.writeQuery({
              //   query: ALL_PRODUCTS_BY_TYPE_ID,
              //   variables: { typeId: this.productTypeId },
              //   data
              // });
            } catch (error) {
            }
          }
        });
        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Added");
        this.resetForm();
        this.close();
      } catch (error) {
        this.error = error;
        this.scrollToTop();
      }
    }
  }
};
</script>
