<template>
  <v-card>
    <v-card-text v-if="loading" class="pa-5">
      <v-progress-circular
        indeterminate
        :size="26"
        color="secondary"
      ></v-progress-circular>
    </v-card-text>
    <template v-if="loaded">
      <v-card-title class="primary--text">
        <span>
          Add a
          <span class="font-italic"> product type </span>
        </span>
      </v-card-title>
      <v-card flat class="px-3">
        <v-divider class="mb-5"></v-divider>
        <form-product-type v-model="value" @valid="valid = $event">
        </form-product-type>
        <v-divider></v-divider>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="$emit('cancel')"> Cancel </v-btn>
        <v-btn
          color="primary"
          :disabled="unchanged || !valid"
          text
          @click="submit"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </template>
    <dev-tool-loading-state-overriding-menu
      v-model="devtoolState"
    ></dev-tool-loading-state-overriding-menu>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "pinia";
import { useStore } from "@/stores/main";

import CREATE_PRODUCT_TYPE from "@/graphql/mutations/CreateProductType.gql";
import ALL_FIELDS from "@/graphql/queries/AllFields.gql";

import FormProductType from "./FormProductType.vue";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

export default Vue.extend({
  name: "ProductTypeAddForm",
  components: {
    FormProductType,
    DevToolLoadingStateOverridingMenu,
  },
  data() {
    const initialValue = {
      name: "",
      order: 1,
      indefArticle: "a",
      singular: "",
      plural: "",
      icon: "mdi-beaker-question-outline",
    };
    return {
      initialValue,
      value: { ...initialValue },
      valid: false,
      fields: [],
      init: true,
      devtoolState: null,
      State: State,
    };
  },
  computed: {
    state() {
      if (this.devtoolState) return this.devtoolState;
      if (this.$apollo.loading) return State.LOADING;
      if (this.error) return State.ERROR;
      if (this.init) return State.INIT;
      if (this.fields) return State.LOADED;
      return State.NONE;
    },
    loading() {
      return this.state == State.LOADING;
    },
    loaded() {
      return this.state == State.LOADED;
    },
    unchanged() {
      return JSON.stringify(this.value) === JSON.stringify(this.initialValue);
    },
    fieldIds() {
      return this.fields.map(({ fieldId }) => parseInt(fieldId, 10));
    },
    input() {
      if (!this.valid) return null;
      return this.composeInput(this.value, this.initialValue);
    },
  },
  apollo: {
    fields: {
      query: ALL_FIELDS,
      update(data) {
        if (!data.allFields) return [];
        return data.allFields.edges.map(({ node }) => node);
      },
      result(result) {
        this.init = false;
        this.error = result.error || null;
      },
    },
  },
  methods: {
    composeInput(value, initialValue) {
      const ret = { ...value };
      ret.fieldIds = this.fieldIds;
      return ret;
    },
    async submit() {
      try {
        const data = await this.$apollo.mutate({
          mutation: CREATE_PRODUCT_TYPE,
          variables: {
            input: this.input,
          },
        });
        this.$apollo.provider.defaultClient.cache.data.data = {};
        this.apolloMutationCalled();
        this.setSnackbarMessage("Added");
        this.$emit("finished", this.input.name);
      } catch (error) {
        this.error = error;
      }
    },
    ...mapActions(useStore, ["apolloMutationCalled", "setSnackbarMessage"]),
  },
});
</script>
