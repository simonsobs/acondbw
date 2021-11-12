<template>
  <v-container style="position: relative">
    <v-row justify="end">
      <v-col style="flex: 0">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ on }">
            <v-btn icon @click="refetch()" v-on="on">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Refresh</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-progress-circular
      v-if="loading"
      indeterminate
      :size="26"
      color="secondary"
    ></v-progress-circular>
    <v-alert v-else-if="queryError" type="error">{{ queryError }}</v-alert>
    <template v-if="loaded">
      <v-row v-for="(r, i) in relations" :key="i">
        <v-col>
          <v-card outlined>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    label="Relation type"
                    :items="relationTypeItems"
                    clearable
                    v-model="r.typeId"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                    label="Product type"
                    :items="productTypeItems"
                    clearable
                    v-model="r.productTypeId"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    label="Product"
                    :items="productTypeMap[r.productTypeId]"
                    clearable
                    hide-no-data
                    v-model="r.productId"
                  ></v-autocomplete>
                </v-col>
                <v-col align-self="center" cols="1">
                  <v-container>
                    <v-row justify="end">
                      <v-col class="pa-0" style="flex: 0">
                        <v-tooltip bottom open-delay="800">
                          <template v-slot:activator="{ on }">
                            <v-btn icon @click="deleteField(i)" v-on="on">
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </template>
                          <span>Delete the field</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn color="secondary" outlined text @click="addField()"
            >Add a field</v-btn
          >
        </v-col>
      </v-row>
    </template>
    <dev-tool-loading-state-overriding-menu
      @state="devtoolState = $event"
    ></dev-tool-loading-state-overriding-menu>
  </v-container>
</template>

<script>
import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

import QueryForFormRelations from "@/graphql/queries/QueryForFormRelations.gql";

const formRelationDefault = {
  typeId: null,
  productTypeId: null,
  productId: null,
};

export default {
  name: "FormRelations",
  components: {
    DevToolLoadingStateOverridingMenu,
  },
  props: ["relations"],
  data() {
    return {
      allProductRelationTypes: { edges: [] },
      allProductTypes: { edges: [] },
      init: true,
      queryError: null,
      refreshing: false,
      devtoolState: null,
      State: State,
    };
  },
  computed: {
    state() {
      if (this.devtoolState) return this.devtoolState;
      if (this.refreshing) return State.LOADING;
      if (this.$apollo.loading) return State.LOADING;
      if (this.queryError) return State.ERROR;
      if (this.allProductRelationTypes) return State.LOADED;
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
    relationTypeItems() {
      return this.allProductRelationTypes.edges.map(({ node }) => ({
        text: node.singular,
        value: node.typeId,
      }));
      // [{ text: relation type name (singular), value: relation type id }]
      // e.g., [{ text: "parent", value: "1" }, { text: "child", value: "2" }];
    },
    productTypeItems() {
      return this.allProductTypes.edges.map(({ node }) => ({
        text: node.singular,
        value: node.typeId,
      }));
      // [{ text: product type name (singular), value: product type id }]
      // e.g., [{ text: "map", value: "1" }, { text: "beam", value: "2" }];
    },
    productTypeMap() {
      return this.allProductTypes.edges.reduce(
        (a, { node }) => ({
          ...a,
          [node.typeId]: node.products.edges.map(({ node }) => ({
            text: node.name,
            value: node.productId,
          })),
        }),
        {}
      );
      // { product type id: [{ text: product name, value: product id }] }
      // e.g., { 1: [{text: "lat20190213", value: "1001"}, ...], 2: [...], ... }
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
  apollo: {
    allProductRelationTypes: {
      query: QueryForFormRelations,
      result(result) {
        this.init = false;

        this.queryError = result.error || null;
        if (this.queryError) return;

        this.allProductRelationTypes = result.data.allProductRelationTypes;
        this.allProductTypes = result.data.allProductTypes;
      },
    },
  },
  methods: {
    addField() {
      this.relations.push({ ...formRelationDefault });
    },
    deleteField(i) {
      this.relations.splice(i, 1);
    },
    async refetch() {
      this.refreshing = true;
      const wait = new Promise((resolve) => setTimeout(resolve, 500));
      Object.values(this.$apollo.queries).forEach((query) => query.refetch());
      await wait; // wait until 0.5 sec passes since starting refetch
      // because the progress circular is too flickering if
      // the refetch finishes too quickly
      this.refreshing = false;
    },
  },
};
</script>
