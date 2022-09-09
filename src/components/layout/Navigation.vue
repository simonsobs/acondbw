<template>
  <div class="navigation">
    <v-card flat>
      <v-list v-if="loaded" shaped>
        <v-list-item
          link
          router
          v-for="edge in edges"
          :key="edge.node.typeId"
          :to="{
            name: 'ProductList',
            params: { productTypeName: edge.node.name },
          }"
        >
          <v-list-item-action class="mr-5">
            <v-icon v-text="edge.node.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title
              v-text="edge.node.plural"
              class="capitalize condensed-font font-weight-medium"
            ></v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon class="ml-2">
            <v-chip
              small
              v-if="!!edge.node.products.totalCount"
              v-text="edge.node.products.totalCount"
            ></v-chip>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
      <v-card-text v-if="empty" outlined dense type="info" class="ma-2">
        No product types are defined.
      </v-card-text>
      <v-card-actions v-if="loaded || empty" class="px-5 py-0">
        <v-spacer></v-spacer>
        <v-tooltip left open-delay="800">
          <template v-slot:activator="{ on: tooltip }">
            <v-dialog persistent v-model="addDialog" max-width="800">
              <template v-slot:activator="{ on: addDialog }">
                <v-btn icon v-on="{ ...tooltip, ...addDialog }">
                  <v-icon x-small>mdi-plus-thick</v-icon>
                </v-btn>
              </template>
              <product-type-add-form
                v-if="addDialog"
                @cancel="onAddFormCancelled"
                @finished="onAddFormFinished"
              ></product-type-add-form>
            </v-dialog>
          </template>
          <span> Add a product type </span>
        </v-tooltip>
      </v-card-actions>
      <v-progress-circular
        v-if="loading"
        indeterminate
        :size="18"
        :width="3"
        color="secondary"
        class="mx-5 mt-5"
      ></v-progress-circular>
      <v-alert v-if="error" outlined dense type="error" class="ma-2">
        {{ error }}
      </v-alert>
    </v-card>
    <v-bottom-navigation absolute class="px-3 justify-start align-center">
      <span class="grey--text text-caption"> v{{ appVersion }} </span>
      <!-- <v-spacer></v-spacer>
      <v-icon>mdi-plus-thick</v-icon> -->
    </v-bottom-navigation>
    <dev-tool-loading-state-overriding-menu
      v-model="devtoolState"
    ></dev-tool-loading-state-overriding-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapState } from "pinia";
import { useStore } from "@/stores/main";

import ALL_PRODUCT_TYPES from "@/graphql/queries/AllProductTypes.gql";

import State from "@/utils/LoadingState";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

import ProductTypeAddForm from "@/components/product-type/ProductTypeAddForm.vue";

export default defineComponent({
  name: "Navigation",
  components: {
    DevToolLoadingStateOverridingMenu,
    ProductTypeAddForm,
  },
  data: () => ({
    init: true,
    edges: [],
    error: null,
    addDialog: false,
    devtoolState: null,
    State: State,
  }),
  computed: {
    state() {
      if (this.devtoolState) return this.devtoolState;
      if (this.$apollo.loading) return State.LOADING;
      if (this.error) return State.ERROR;
      if (this.edges) {
        if (this.edges.length) return State.LOADED;
        return State.EMPTY;
      }
      if (this.init) return State.INIT;
      return State.NONE;
    },
    loading() {
      return this.state == State.LOADING;
    },
    loaded() {
      return this.state == State.LOADED;
    },
    empty() {
      return this.state == State.EMPTY;
    },
    notFound() {
      return this.state == State.NONE;
    },
    ...mapState(useStore, ["nApolloMutations", "appVersion"]),
  },
  watch: {
    devtoolState: function () {
      if (this.devtoolState) {
        this.init = this.devtoolState == State.INIT;
      }
      this.error =
        this.devtoolState == State.ERROR ? "Error from Dev Tools" : null;
    },
    nApolloMutations: function () {
      this.$apollo.queries.edges.refetch();
    },
  },
  apollo: {
    edges: {
      query: ALL_PRODUCT_TYPES,
      update: (data) =>
        data.allProductTypes ? data.allProductTypes.edges : null,
      result(result) {
        this.init = false;
        this.error = result.error || null;
      },
    },
  },
  methods: {
    onAddFormCancelled() {
      this.closeAddForm();
    },
    onAddFormFinished() {
      this.closeAddForm();
    },
    closeAddForm() {
      this.addDialog = false;
    },
  },
});
</script>
