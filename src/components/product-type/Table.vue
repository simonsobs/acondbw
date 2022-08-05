<template>
  <v-card-text class="" style="position: relative">
    <v-data-table
      :loading="loading"
      loading-text="Loading..."
      :headers="headers"
      :items="items"
      :items-per-page="edges.length"
      :hide-default-footer="true"
      class="elevation-1"
      @click:row="onClickRow"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn :disabled="loading" icon @click="refresh">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn fab class="secondary">
            <v-icon class="on-secondary--text">mdi-plus-thick</v-icon>
          </v-btn>
        </v-toolbar>
        <v-alert dismissible v-model="alert" type="error">
          {{ error }}
        </v-alert>
      </template>
      <template v-slot:[`item.node.icon`]="{ item }">
        <v-icon v-text="item.node.icon"></v-icon>
      </template>
      <template v-slot:[`item.node.name`]="{ item }">
        <span class="font-weight-bold primary--text">{{ item.node.name }}</span>
      </template>
      <template v-slot:[`item.node.products.totalCount`]="{ item }">
        <v-chip v-text="item.node.products.totalCount"></v-chip>
      </template>
      <template v-slot:[`item.actions`]>
        <v-icon small class="mr-2"> mdi-pencil </v-icon>
        <v-icon small> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <dev-tool-loading-state-overriding-menu
      v-model="devtoolState"
    ></dev-tool-loading-state-overriding-menu>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "pinia";
import { useStore } from "@/stores/main";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

import ALL_PRODUCTS_TYPES from "@/graphql/queries/AllProductTypes.gql";

export default Vue.extend({
  name: "ProductTypeTable",
  components: {
    DevToolLoadingStateOverridingMenu,
  },
  data: () => ({
    edges: [],
    headers: [
      { text: "Icon", value: "node.icon", sortable: false, width: "90px" },
      { text: "Name", value: "node.name", sortable: false },
      { text: "Singular", value: "node.singular", sortable: false },
      { text: "Plural", value: "node.plural", sortable: false },
      {
        text: "Count",
        value: "node.products.totalCount",
        sortable: false,
        width: "90px",
        align: "center",
      },
      { text: "Actions", value: "actions", sortable: false, align: "end" },
    ],
    init: true,
    alert: false,
    error: null,
    devtoolState: null,
    refreshing: false,
    State: State,
  }),
  apollo: {
    edges: {
      query: ALL_PRODUCTS_TYPES,
      update: (data) => data.allProductTypes.edges,
    },
  },
  computed: {
    state() {
      if (this.devtoolState) return this.devtoolState;
      if (this.refreshing) return State.LOADING;
      if (this.edges) {
        if (this.edges.length) return State.LOADED;
        return State.EMPTY;
      }
      if (this.$apollo.queries.edges.loading) return State.LOADING;
      if (this.error) return State.ERROR;
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
    items() {
      if (this.loading) return [];
      if (this.empty) return [];
      return this.edges;
    },
    ...mapState(useStore, ["nApolloMutations"]),
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
      this.refresh();
    },
    error: function (val, oldVal) {
      this.alert = !!val;
    },
    alert: function (val, oldVal) {
      if (!val) this.error = null;
    },
  },
  methods: {
    async refresh() {
      this.refreshing = true;
      const wait = new Promise((resolve) => setTimeout(resolve, 500));
      await this.$apollo.queries.edges.refetch();
      await wait; // wait until 0.5 sec passes since starting refetch
      // because the progress circular is too flickering if
      // the refetch finishes too quickly
      this.refreshing = false;
    },
    onClickRow(item) {
      // console.log(item);
    },
  },
});
</script>
