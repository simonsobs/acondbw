<template>
  <div style="position: relative" class="">
    <v-card-actions class="py-0">
      <v-tooltip bottom open-delay="800">
        <template v-slot:activator="{ on }">
          <v-btn icon @click="refetch()" v-on="on">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Refresh</span>
      </v-tooltip>
    </v-card-actions>
    <v-card-text>
      <v-progress-circular
        v-if="loading"
        indeterminate
        :size="26"
        color="secondary"
      ></v-progress-circular>
      <v-alert v-else-if="queryError" type="error">{{ queryError }}</v-alert>
    </v-card-text>
    <div v-if="loaded" class="pb-5">
      <div v-for="({ node }, i) in allProductRelationTypes.edges" :key="i">
        <v-card-title class="capitalize">{{ node.plural }}</v-card-title>
        <v-container class="">
          <v-row
            v-for="(e, i) in formMap[node.typeId]"
            :key="i"
            class="flex-nowrap"
          >
            <v-card-text>
              <v-autocomplete
                :label="node.singular"
                :items="productItems"
                outlined
                clearable
                hide-details
                hide-no-data
                v-model="e.productId"
              ></v-autocomplete>
            </v-card-text>
            <v-card-actions>
              <v-tooltip bottom open-delay="800">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    @click="formMap[node.typeId].splice(i, 1)"
                    v-on="on"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete the field</span>
              </v-tooltip>
            </v-card-actions>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            outlined
            text
            @click="formMap[node.typeId].push({ productId: null })"
          >
            Add a field</v-btn
          >
        </v-card-actions>
      </div>
    </div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="reset">Reset</v-btn>
    </v-card-actions>
    <dev-tool-loading-state-overriding-menu
      v-model="devtoolState"
    ></dev-tool-loading-state-overriding-menu>
  </div>
</template>

<script>
import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

import QueryForFormRelations from "@/graphql/queries/QueryForFormRelations.gql";

export default {
  name: "FormRelations",
  components: {
    DevToolLoadingStateOverridingMenu,
  },
  props: { value: Array },
  data() {
    const reshapedValueReset = this.reshapeValue(this.value);
    return {
      reshapedValueReset,
      formMap: JSON.parse(JSON.stringify(reshapedValueReset)),
      allProductRelationTypes: { edges: [] },
      allProducts: { edges: [] },
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
    productItems() {
      return this.allProducts.edges.map(({ node }) => ({
        text: `${node.name} (${node.type_.singular})`,
        value: node.productId,
      }));
      // [{ text: product name (product type name), value: product id }]
      // e.g., [{ text: "Map-01 (map)", value: "1" }, ...];
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
    allProductRelationTypes(val) {
      const reshapedValue = this.reshapeValue(this.value);
      this.formMap = this.composeFormMap(val, reshapedValue);
    },
    formMap: {
      handler(val) {
        const r = Object.entries(val).reduce((a, e) => {
          const typeId = e[0];
          const l = e[1].filter((x) => x.productId !== null);
          return [...a, ...l.map((o) => ({ productId: o.productId, typeId }))];
        }, []);
        this.$emit("input", r);
      },
      deep: true,
      immediate: true,
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
        this.allProducts = result.data.allProducts;
      },
    },
  },
  methods: {
    async refetch() {
      this.refreshing = true;
      const wait = new Promise((resolve) => setTimeout(resolve, 500));
      Object.values(this.$apollo.queries).forEach((query) => query.refetch());
      await wait; // wait until 0.5 sec passes since starting refetch
      // because the progress circular is too flickering if
      // the refetch finishes too quickly
      this.refreshing = false;
    },
    reshapeValue(val) {
      if (!val) return {};
      return val.reduce((a, o) => {
        if (o.typeId in a) {
          a[o.typeId].push({ productId: o.productId });
          return a;
        } else {
          return { ...a, [o.typeId]: [{ productId: o.productId }] };
        }
      }, {});
    },
    composeFormMap(allProductRelationTypes, reshapedValue) {
      return allProductRelationTypes.edges.reduce(
        (a, { node }) => ({
          ...a,
          [node.typeId]: [
            ...(reshapedValue[node.typeId] || []),
            { productId: null },
          ],
        }),
        {}
      );
    },
    reset() {
      this.formMap = this.composeFormMap(
        this.allProductRelationTypes,
        this.reshapedValueReset
      );
    },
  },
};
</script>
