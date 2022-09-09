<template>
  <v-card
    outlined
    max-width="960px"
    class="product-add-form mx-auto"
    style="border: 0; position: relative"
  >
    <v-card-title v-if="loaded" class="text-h3 primary--text">
      <span>
        Add {{ productType.indefArticle }}
        <span class="font-italic font-weight-light">
          {{ productType.singular }}
        </span>
      </span>
    </v-card-title>
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <v-stepper v-if="loaded" v-model="stepper">
      <v-stepper-header>
        <v-stepper-step :complete="stepper > 1" step="1">
          Start
        </v-stepper-step>
        <v-stepper-step :complete="stepper > 2" step="2">
          Relations
        </v-stepper-step>
        <v-stepper-step :complete="stepper > 3" step="3">
          Preview
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <product-add-form-step-start
            v-model="formStepStart"
            :productType="productType"
            @cancel="close()"
            @next="stepper = 2"
          ></product-add-form-step-start>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-items>
        <v-stepper-content step="2">
          <product-add-form-step-relations
            v-model="formStepRelation"
            :name="formStepStart && formStepStart.name"
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
            :productType="productType"
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
        >
          {{ queryError }}
        </v-alert>
        <v-card-text v-else-if="notFound"> Not Found </v-card-text>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="close()"> Close </v-btn>
      </v-card-actions>
    </div>
    <dev-tool-loading-state-overriding-menu
      v-model="devtoolState"
    ></dev-tool-loading-state-overriding-menu>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

import _ from "lodash";
import { camelCase } from "camel-case";

import QueryForProductAddForm from "@/graphql/queries/QueryForProductAddForm.gql";
import CREATE_PRODUCT from "@/graphql/mutations/CreateProduct.gql";

import ProductAddFormStepStart from "./ProductAddFormStepStart.vue";
import ProductAddFormStepRelations from "./ProductAddFormStepRelations.vue";
import ProductAddFormStepPreview from "./ProductAddFormStepPreview.vue";

import State from "@/utils/LoadingState";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

export default defineComponent({
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
      formStepStart: null,
      formStepRelation: null,
      error: null,
      createProductInput: null,
    };
  },
  computed: {
    state() {
      if (this.devtoolState) return this.devtoolState;
      if (this.$apollo.loading) return State.LOADING;
      if (this.queryError) return State.ERROR;
      if (this.productType) return State.LOADED;
      if (this.init) return State.INIT;
      return State.NONE;
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
        if (this.queryError) return;

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
    },
    preview() {
      try {
        this.createProductInput = this.composeCreateProductInput(
          this.productTypeId,
          this.formStepStart,
          this.formStepRelation
        );
      } catch (error) {
        this.error = error;
      } finally {
        this.stepper = 3;
      }
    },
    async submit() {
      try {
        await this.addProduct(this.createProductInput);
      } catch (error) {
        this.error = error;
        this.stepper = 1;
        return;
      }
      this.apolloMutationCalled();
      this.setSnackbarMessage("Added");
      this.close();
    },
    composeCreateProductInput(productTypeId, formStepStart, formStepRelation) {
      const ret = {
        name: formStepStart.name,
        note: formStepStart.note,
      };

      ret.typeId = productTypeId;

      ret.paths = formStepStart.paths
        .split("\n")
        .map((x) => x.trim()) // trim e.g., " /a/b/c " => "/a/b/c"
        .filter(Boolean) // remove empty strings
        .filter((v, i, a) => a.indexOf(v) === i); // unique

      // unique https://medium.com/coding-at-dawn/how-to-use-set-to-filter-unique-items-in-javascript-es6-196c55ce924b
      ret.relations = [
        ...new Set(formStepRelation.map((o) => JSON.stringify(o))),
      ].map((s) => JSON.parse(s));

      const keys = ["contact", "dateProduced", "producedBy"].filter(
        (k) => k in this.fields
      );
      ret.attributes = keys.reduce((a, k) => {
        const typeName = camelCase(this.fields[k].field.type_);
        a[typeName] = a[typeName] ? a[typeName] : [];
        a[typeName].push({
          fieldId: this.fields[k].fieldId,
          value: formStepStart[k],
        });
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
    ...mapActions(useStore, ["apolloMutationCalled", "setSnackbarMessage"]),
  },
});
</script>
