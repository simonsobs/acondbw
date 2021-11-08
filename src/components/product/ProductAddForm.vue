<template>
  <v-card
    outlined
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
          <product-add-form-step-start
            :form="form"
            :form-reset-count="formResetCount"
            :productType="productType"
            @cancel="close()"
            @reset="resetForm()"
            @next="stepper = 2"
          ></product-add-form-step-start>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-items>
        <v-stepper-content step="2">
          <product-add-form-step-relations
            :name="form.name"
            :relations="form.relations"
            :productType="productType"
            @cancel="close()"
            @back="stepper = 1"
            @preview="preview"
          ></product-add-form-step-relations>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-items>
        <v-stepper-content step="3">
          <product-add-form-step-preview
            :createProductInput="createProductInput"
            @cancel="close()"
            @back="stepper = 2"
            @submit="submit"
          ></product-add-form-step-preview>
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
            color="secondary"
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
import { camelCase } from "camel-case";

import QueryForProductAddForm from "@/graphql/queries/QueryForProductAddForm.gql";
import CREATE_PRODUCT from "@/graphql/mutations/CreateProduct.gql";

import ProductAddFormStepStart from "./ProductAddFormStepStart.vue";
import ProductAddFormStepRelations from "./ProductAddFormStepRelations.vue";
import ProductAddFormStepPreview from "./ProductAddFormStepPreview.vue";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

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
    ProductAddFormStepStart,
    ProductAddFormStepRelations,
    ProductAddFormStepPreview,
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
      formResetCount: 0,
      error: null,
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
    fields() {
      if (!this.productType) return null;
      const ret = this.productType.fields.edges.reduce(
        (a, { node }) => ({
          ...a,
          ...{
            [camelCase(node.field.name)]: node,
          },
        }),
        {}
      );
      return ret;
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
    close() {
      this.$emit("finished");
      setTimeout(() => {
        this.resetForm();
      }, 500); // reset 0.5 sec after so that the reset form won't be shown.
    },
    resetForm() {
      // this.$refs.form.reset();
      // This line is commented out because it resets "form" to
      // the empty object {}.
      // Instead, the following two lines are used.
      this.form = _.cloneDeep(formDefault);
      this.formResetCount++;
      this.error = null;
      this.stepper = 1;
    },
    async preview() {
      try {
        this.createProductInput = this.composeCreateProductInput(
          this.productTypeId,
          this.form
        );
        this.stepper = 3;
      } catch (error) {
        this.error = error;
      }
      this.stepper = 3;
    },
    async submit() {
      try {
        await this.addProduct(this.createProductInput);
      } catch (error) {
        this.error = error;
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

      // unique https://medium.com/coding-at-dawn/how-to-use-set-to-filter-unique-items-in-javascript-es6-196c55ce924b
      ret.relations = [
        ...new Set(ret.relations.map((o) => JSON.stringify(o))),
      ].map((s) => JSON.parse(s));

      const keys = ["contact", "dateProduced", "producedBy"].filter(
        (k) => k in this.fields
      );
      ret.attributes = keys.reduce((a, k) => {
        const typeName = camelCase(this.fields[k].field.type_);
        a[typeName] = a[typeName] ? a[typeName] : [];
        a[typeName].push({ fieldId: this.fields[k].fieldId, value: ret[k] });
        return a;
      }, {});

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
