<template>
  <v-card
    outlined
    max-width="980px"
    class="product-add-form mx-auto"
    style="border: 0; position: relative"
  >
    <v-card-title v-if="loaded" class="text-h3 primary--text"
      >Add {{ productType.indefArticle }}
      {{ productType.singular }}</v-card-title
    >
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <v-stepper v-if="loaded" v-model="stepper">
      <v-stepper-header>
        <v-stepper-step :complete="stepper > 1" step="1">Start</v-stepper-step>
        <v-stepper-step :complete="stepper > 2" step="2"
          >Relations</v-stepper-step
        >
        <v-stepper-step :complete="stepper > 3" step="3"
          >Preview</v-stepper-step
        >
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-form ref="form" v-model="valid">
            <v-container fluid>
              <v-row>
                <v-col order="1" cols="12" md="4">
                  <v-text-field
                    label="Name*"
                    required
                    :hint="
                      'Name of the ' +
                      productType.singular +
                      '. This field cannot be changed later.'
                    "
                    persistent-hint
                    v-model="form.name"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
                <v-col order="3" cols="6" md="4">
                  <v-text-field-with-date-picker
                    label="Date produced (YYYY-MM-DD)*"
                    :hint="
                      'The date on which the ' +
                      productType.singular +
                      ' was produced, e.g., 2020-05-06. This field cannot be changed later.'
                    "
                    v-model="form.dateProduced"
                    :rules="requiredRules"
                  ></v-text-field-with-date-picker>
                </v-col>
                <v-col order="4" cols="6" md="4">
                  <v-text-field
                    label="Produced by*"
                    required
                    :hint="
                      'The person or group that produced the ' +
                      productType.singular +
                      ', e.g. pwg-xxx. This field cannot be changed later.'
                    "
                    persistent-hint
                    v-model="form.producedBy"
                    :rules="requiredRules"
                  ></v-text-field>
                </v-col>
                <v-col order="4" cols="6" offset-md="4" md="4">
                  <v-text-field
                    label="Contact*"
                    required
                    :hint="
                      'A person or group that can be contacted for questions or issues about the ' +
                      productType.singular +
                      '.'
                    "
                    persistent-hint
                    v-model="form.contact"
                    :rules="requiredRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
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
              <v-row>
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
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" text @click="close()">Cancel</v-btn>
              <v-btn color="secondary" text @click="resetForm()">Reset</v-btn>
              <v-btn
                color="primary"
                :disabled="!valid"
                text
                @click="stepper = 2"
                >Next</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-items>
        <v-stepper-content step="2">
          <v-card-text>
            <div class="caption grey--text">
              New {{ productType.singular }} name
            </div>
            <div class="grey--text text--darken-2" v-text="form.name"></div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-title class="primary--text"
            >Add relations to other products</v-card-title
          >
          <form-relations :relations="form.relations"></form-relations>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="close()">Cancel</v-btn>
            <v-btn color="secondary" text @click="stepper = 1">Back</v-btn>
            <v-btn color="primary" text @click="preview">Preview</v-btn>
          </v-card-actions>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-items>
        <v-stepper-content step="3">
          <pre>{{ createProductInput }}</pre>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="close()">Cancel</v-btn>
            <v-btn color="secondary" text @click="stepper = 2">Back</v-btn>
            <v-btn color="primary" text @click="submit">Submit</v-btn>
          </v-card-actions>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <div v-else>
      <v-card outlined>
        <div v-if="loading" class="mx-4 py-2">
          <v-progress-circular
            indeterminate
            :size="18"
            :width="3"
            color="grey"
          ></v-progress-circular>
        </div>
        <v-alert
          v-else-if="queryError"
          outlined
          dense
          type="error"
          class="ma-2"
          >{{ queryError }}</v-alert
        >
        <v-card-text v-else-if="notFound">Not Found</v-card-text>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="close()">Close</v-btn>
      </v-card-actions>
    </div>
    <dev-tool-loading-state-overriding-menu
      @state="devtoolState = $event"
    ></dev-tool-loading-state-overriding-menu>
  </v-card>
</template>
  
<script>
import _ from "lodash";

import QueryForProductAddForm from "@/graphql/queries/QueryForProductAddForm.gql";
import CREATE_PRODUCT from "@/graphql/mutations/CreateProduct.gql";

import VTextFieldWithDatePicker from "@/components/utils/VTextFieldWithDatePicker";
import FormRelations from "./FormRelations";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu";

const formRelationDefault = {
  typeId: null,
  productTypeId: null,
  productId: null,
};

const formDefault = {
  name: "",
  contact: "",
  dateProduced: new Date().toISOString().substr(0, 10),
  producedBy: "",
  paths: "",
  relations: [{ ...formRelationDefault }, { ...formRelationDefault }],
  note: "",
};

export default {
  name: "ProductAddForm",
  components: {
    VTextFieldWithDatePicker,
    FormRelations,
    DevToolLoadingStateOverridingMenu,
  },
  props: {
    productTypeId: { required: true },
  },
  data() {
    return {
      stepper: 1,
      productType: null,
      init: true,
      queryError: null,
      devtoolState: null,
      State: State,
      step: 1,
      form: _.cloneDeep(formDefault),
      valid: true,
      error: null,
      nameRules: [
        (v) => !!v || "This field is required",
        (v) => (v || "").indexOf(" ") < 0 || "No spaces are allowed",
      ],
      requiredRules: [(v) => !!v || "This field is required"],
      createProductInput: null,
    };
  },
  computed: {
    state() {
      if (this.devtoolState) {
        return this.devtoolState;
      }

      if (this.$apollo.queries.productType.loading) {
        return State.LOADING;
      } else if (this.queryError) {
        return State.ERROR;
      } else if (this.productType) {
        return State.LOADED;
      } else if (this.init) {
        return State.INIT;
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.state == State.LOADING;
    },
    loaded() {
      return this.state == State.LOADED;
    },
    notFound() {
      return this.state == State.NONE;
    },
  },
  apollo: {
    productType: {
      query: QueryForProductAddForm,
      variables() {
        return { typeId: this.productTypeId };
      },
      skip: function () {
        return !this.productTypeId;
      },
      result(result) {
        this.init = false;
        this.queryError = result.error ? result.error : null;
        if (this.queryError) {
          return;
        }

        this.productType = result.data.productType;
      },
    },
  },
  watch: {
    devtoolState: function () {
      if (this.devtoolState) {
        this.init = this.devtoolState == State.INIT;
      }
      this.queryError =
        this.devtoolState == State.ERROR ? "Error from Dev Tools" : null;
    },
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
    preview() {
      this.createProductInput = this.composeCreateProductInput(
        this.productTypeId,
        this.form
      );
      this.stepper = 3;
    },
    async submit() {
      try {
        await this.addProduct(this.createProductInput);
      } catch (error) {
        this.error = error;
        this.scrollToTop();
        this.stepper = 1;
        return;
      }
      this.$store.dispatch("apolloMutationCalled");
      this.$store.dispatch("snackbarMessage", "Added");
      this.resetForm();
      this.close();
    },
    composeCreateProductInput(productTypeId, form) {
      const ret = _.pick(form, [
        "name",
        "contact",
        "dateProduced",
        "producedBy",
        "note",
      ]);

      ret.typeId = productTypeId;

      const paths = form.paths
        .split("\n")
        .map((x) => x.trim()) // trim e.g., " /a/b/c " => "/a/b/c"
        .filter(Boolean) // remove empty strings
        .filter((v, i, a) => a.indexOf(v) === i); // unique

      ret.paths = paths;

      ret.relations = _.filter(
        _.map(form.relations, (x) =>
          _.pickBy(_.pick(x, ["typeId", "productId"]), _.identity)
        ),
        (x) => _.size(x) == 2
      );
      return ret;
    },
    async addProduct(createProductInput) {
      await this.$apollo.mutate({
        mutation: CREATE_PRODUCT,
        variables: { input: createProductInput },
        update: (cache, { data: { createProduct } }) => {
          try {
            // Delete all cache and dispacth "apolloMutationCalled", which triggers refetch
            this.$apollo.provider.defaultClient.cache.data.data = {};

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
          } catch (error) {}
        },
      });
    },
  },
};
</script>
