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
          <product-add-form-step-start
            :form="form"
            :productType="productType"
            @cancel="close()"
            @reset="resetForm()"
            @next="stepper = 2"
          ></product-add-form-step-start>
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
          <v-card-text v-if="createProductInput">
            <div class="caption grey--text">Name</div>
            <div class="font-weight-bold">{{ createProductInput.name }}</div>
            <div class="caption grey--text">Date produced</div>
            <div v-text="createProductInput.dateProduced"></div>
            <div class="caption grey--text">Produced by</div>
            <div v-text="createProductInput.producedBy"></div>
            <div class="caption grey--text">Contact</div>
            <div v-text="createProductInput.contact"></div>
            <div class="caption grey--text">Paths</div>
            <ul
              v-if="
                createProductInput.paths && createProductInput.paths.length > 0
              "
            >
              <li
                v-for="(p, index) in createProductInput.paths"
                :key="index"
                v-text="p"
              ></li>
            </ul>
            <div v-else class="body-2 grey--text">None</div>
            <div class="caption grey--text">Note</div>
            <div v-if="notePreview" class="markdown-body" v-html="notePreview"></div>
            <div v-else class="body-2 grey--text">None</div>
            <div class="caption grey--text">Relations</div>
            <ul v-if="relationPreview && relationPreview.length > 0">
              <li v-for="(r, index) in relationPreview" :key="index">
                {{ r.relationTypeSingular }}: {{ r.productName }} ({{
                  r.productTypeSingular
                }})
              </li>
            </ul>
            <div v-else class="body-2 grey--text">None</div>
          </v-card-text>
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

import marked from "marked";

import gql from "graphql-tag";

import QueryForProductAddForm from "@/graphql/queries/QueryForProductAddForm.gql";
import CREATE_PRODUCT from "@/graphql/mutations/CreateProduct.gql";

import ProductAddFormStepStart from "./ProductAddFormStepStart";
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
    ProductAddFormStepStart,
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
      error: null,
      createProductInput: null,
      relationPreview: null,
      notePreview: null,
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
    noteMarked() {
      return this.form.note
        ? marked(this.form.note)
        : "<em>Nothing to preview</em>";
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
      this.error = null;
      this.stepper = 1;
    },
    async preview() {
      try {
        this.createProductInput = this.composeCreateProductInput(
          this.productTypeId,
          this.form
        );
        this.relationPreview = await this.composeRelationPreview(
          this.createProductInput.relations
        );
        this.notePreview = this.createProductInput.note
          ? marked(this.createProductInput.note)
          : null;
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
    async composeRelationPreview(relations) {
      const QUERY_FOR_PRODUCT_ADD_FORM_PREVIEW = gql`
        query QueryForProductAddFormRelationsPreview(
          $productRelationTypeId: Int!
          $productId: Int!
        ) {
          productRelationType(typeId: $productRelationTypeId) {
            singular
          }
          product(productId: $productId) {
            name
            type_ {
              singular
            }
          }
        }
      `;

      // https://flaviocopes.com/javascript-async-await-array-map/
      const ret = await Promise.all(
        relations.map(async (r) => {
          const { data } = await this.$apollo.query({
            query: QUERY_FOR_PRODUCT_ADD_FORM_PREVIEW,
            variables: {
              productRelationTypeId: r.typeId,
              productId: r.productId,
            },
          });
          return {
            relationTypeSingular: data.productRelationType.singular,
            productTypeSingular: data.product.type_.singular,
            productName: data.product.name,
          };
        })
      );

      return ret;
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
