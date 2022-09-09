<template>
  <v-card>
    <v-card-title class="primary--text">
      <span>
        Delete the product type:
        <span class="capitalize font-italic"> {{ node.plural }} </span>
      </span>
    </v-card-title>
    <v-card-text class="body-1 font-weight-medium error--text">
      Really, delete the type?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('cancel')"> Cancel </v-btn>
      <v-btn color="primary" text @click="submit"> Delete </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

import DELETE_PRODUCT_TYPE from "@/graphql/mutations/DeleteProductType.gql";

export default defineComponent({
  name: "ProductTypeDeleteForm",
  props: {
    node: Object,
  },
  data() {
    return {};
  },
  methods: {
    async submit() {
      try {
        const data = await this.$apollo.mutate({
          mutation: DELETE_PRODUCT_TYPE,
          variables: {
            typeId: this.node.typeId,
          },
        });
        this.$apollo.provider.defaultClient.cache.data.data = {};
        this.apolloMutationCalled();
        this.setSnackbarMessage("Deleted");
        this.$emit("finished");
      } catch (error) {
        this.error = error;
      }
    },
    ...mapActions(useStore, ["apolloMutationCalled", "setSnackbarMessage"]),
  },
});
</script>
