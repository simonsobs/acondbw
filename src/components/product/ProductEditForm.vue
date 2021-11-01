<template>
  <div class="product-edit-form" style="position: relative;">
    <v-container>
      <v-card outlined max-width="980px" class="mx-auto my-5">
        <v-card-title
          v-if="state == State.LOADED"
          class="headline primary--text"
        >Update the information about the {{ productType.singular }}</v-card-title>
        <v-card-text
          v-if="state == State.LOADED"
        >This form is for updating the information about the {{ productType.singular }}. If the {{ productType.singular }} itself has been updated, a new entry should be added.</v-card-text>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <v-form v-if="state == State.LOADED" ref="form" v-model="valid">
          <v-divider></v-divider>
          <v-container fluid class="px-0">
            <v-row class="ma-0 px-0">
              <v-col order="1" cols="12" md="4">
                <v-text-field
                  label="Name"
                  readonly
                  disabled
                  :hint="'Name of the ' + productType.singular + '. This field cannot be changed later.'"
                  persistent-hint
                  v-model="node.name"
                ></v-text-field>
              </v-col>
              <v-col order="4" cols="6" md="4">
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
            <v-btn color="primary" :disabled="!(valid && changed)" @click="editProduct()">Update</v-btn>
          </v-card-actions>
        </v-form>
        <div v-else>
          <v-card outlined>
            <div v-if="state == State.LOADING" class="mx-4 py-2">
              <v-progress-circular indeterminate :size="18" :width="3" color="secondary"></v-progress-circular>
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

import PRODUCT from "@/graphql/queries/Product.gql";
import UPDATE_PRODUCT from "@/graphql/mutations/UpdateProduct.gql";

import FormRelations from "./FormRelations.vue";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

export default {
  name: "ProductEditForm",
  components: {
    FormRelations,
    DevToolLoadingStateOverridingMenu
  },
  props: {
    productId: { default: null } // product.productId not product.id
  },
  data() {
    return {
      productType: null,
      node: null,
      form: null,
      valid: true,
      error: null,
      requiredRules: [v => !!v || "This field is required"],
      devtoolState: null,
      State: State
    };
  },
  computed: {
    changed() {
      return !(JSON.stringify(this.form) === JSON.stringify(this.formDefault));
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
        const ret = _.pick(this.node, ["name", "contact", "note"]);
        ret.paths = this.node.paths.edges.map(e => e.node.path).join("\n");
        ret.relations = this.node.relations.edges.map(function(e) {
          return {
            typeId: e.node.type_.typeId,
            productTypeId: e.node.other.type_.typeId,
            productId: e.node.other.productId
          };
        });
        return ret;
      } else {
        return null;
      }
    }
  },
  watch: {
    formDefault: function() {
      this.form = _.cloneDeep(this.formDefault);
    }
  },
  apollo: {
    node: {
      query: PRODUCT,
      variables() {
        return {
          productId: this.productId
        };
      },
      update: data => data.product,
      result(result) {
        this.error = result.error ? result.error : null;
        this.productType = result.data.product.type_;
      }
    }
  },
  methods: {
    scrollToTop() {
      document.getElementsByClassName("v-dialog--active")[0].scrollTop = 0;
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
      this.form = _.cloneDeep(this.formDefault);
      this.$refs.form.resetValidation();
      this.error = null;
    },
    async editProduct() {
      try {
        const updateProductInput = _.pick(this.form, [
          "contact",
          "note"
        ]);

        updateProductInput.paths = this.form.paths
          .split("\n")
          .map(x => x.trim()) // trim e.g., " /a/b/c " => "/a/b/c"
          .filter(Boolean) // remove empty strings
          .filter((v, i, a) => a.indexOf(v) === i); // unique

        updateProductInput.relations = _.filter(
          _.map(this.form.relations, x =>
            _.pickBy(_.pick(x, ["typeId", "productId"]), _.identity)
          ),
          x => _.size(x) == 2
        );

        const data = await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT,
          variables: {
            productId: this.node.productId,
            input: updateProductInput
          }
        });
        this.$store.dispatch("snackbarMessage", "Updated");
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
