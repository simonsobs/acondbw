<template>
  <v-card>
    <v-card-title
      >Update the relations of the {{ node.type_.singular }}
      {{ node.name }}</v-card-title
    >
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
    </v-card-text>
    <form-relations :relations="relations"></form-relations>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      <v-btn color="secondary" text @click="reset">Reset</v-btn>
      <v-btn color="primary" :disabled="unchanged" text @click="submit"
        >Submit</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import _ from "lodash";

import UPDATE_PRODUCT from "@/graphql/mutations/UpdateProduct.gql";
import FormRelations from "./FormRelations.vue";

function composeRelations(node) {
  return node.relations.edges.map(function (e) {
    return {
      typeId: e.node.type_.typeId,
      productTypeId: e.node.other.type_.typeId,
      productId: e.node.other.productId,
    };
  });
}

function composeInput(relations) {
  let ret = _.filter(
    _.map(relations, (x) =>
      _.pickBy(_.pick(x, ["typeId", "productId"]), _.identity)
    ),
    (x) => _.size(x) == 2
  );

  // unique https://medium.com/coding-at-dawn/how-to-use-set-to-filter-unique-items-in-javascript-es6-196c55ce924b
  ret = [...new Set(ret.map((o) => JSON.stringify(o)))].map((s) =>
    JSON.parse(s)
  );

  return ret;
}

export default {
  name: "ProductUpdateRelationsForm",
  components: {
    FormRelations,
  },
  props: {
    node: Object,
  },
  data() {
    return {
      relations: composeRelations(this.node),
      error: null,
    };
  },
  computed: {
    initialRelations() {
      return composeRelations(this.node);
    },
    initialInput() {
      return composeInput(this.initialRelations);
    },
    input() {
      return composeInput(this.relations);
    },
    unchanged() {
      return (
        JSON.stringify(this.input) === JSON.stringify(this.initialInput)
      );
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
      this.delayedReset();
    },
    delayedReset() {
      // reset 0.5 sec after so that the reset form won't be shown.
      setTimeout(() => {
        this.reset();
      }, 500);
    },
    reset() {
      this.relations = this.initialRelations;
      this.error = null;
    },
    async submit() {
      try {
        const updateProductInput = { relations: this.input };
        const data = await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT,
          variables: {
            productId: this.node.productId,
            input: updateProductInput,
          },
        });

        this.$store.dispatch("apolloMutationCalled");
        this.$store.dispatch("snackbarMessage", "Updated");
        this.$emit("finished");
        this.delayedReset();
      } catch (error) {
        this.error = error;
      }
    },
  },
};
</script>