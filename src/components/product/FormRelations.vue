<template>
  <div style="position: relative" class="">
    <!-- <v-card-actions class="py-0">
      <v-tooltip bottom open-delay="800">
        <template v-slot:activator="{ on }">
          <v-btn icon @click="refetch()" v-on="on">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Refresh</span>
      </v-tooltip>
    </v-card-actions> -->
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
      <div
        v-for="({ node }, i) in allProductRelationTypes.edges"
        :key="i"
        class="pb-4"
      >
        <v-divider></v-divider>
        <v-card-title class="text-h5 capitalize">
          {{ node.plural }}
        </v-card-title>
        <v-card-text class="grey--text">
          <span>
            <span class="font-italic capitalize">
              {{ node.plural }}
            </span>
            of <span class="font-italic"> {{ name }}. </span>
            <span class="font-italic"> {{ name }} </span>
            will be {{ node.reverse.indefArticle }}
            <span class="font-italic"> {{ node.reverse.singular }}. </span>
          </span>
        </v-card-text>
        <v-container>
          <v-row
            v-for="(e, i) in form[node.typeId]"
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
                  <v-btn icon @click="form[node.typeId].splice(i, 1)" v-on="on">
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
            @click="form[node.typeId].push({ productId: null })"
          >
            Add a field
          </v-btn>
        </v-card-actions>
      </div>
    </div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" :disabled="unchanged" text @click="reset">
        Reset
      </v-btn>
    </v-card-actions>
    <dev-tool-loading-state-overriding-menu
      v-model="devtoolState"
    ></dev-tool-loading-state-overriding-menu>
  </div>
</template>

<script>
import State from "@/utils/LoadingState";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

import QueryForFormRelations from "@/graphql/queries/QueryForFormRelations.gql";

export default {
  name: "FormRelations",
  components: {
    DevToolLoadingStateOverridingMenu,
  },
  props: { value: Array, name: String },
  data() {
    return {
      form: this.reshapeValue(this.value || []),
      formReset: null,
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
    input() {
      return Object.entries(this.form).reduce((a, e) => {
        const typeId = e[0];
        const l = e[1].filter((x) => x.productId !== null);
        return [...a, ...l.map((o) => ({ productId: o.productId, typeId }))];
      }, []);
    },
    unchanged() {
      if (!this.formReset) return false;
      return JSON.stringify(this.form) === JSON.stringify(this.formReset);
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
      this.form = this.composeForm(val, reshapedValue);
      if (!this.formReset) {
        this.formReset = JSON.parse(JSON.stringify(this.form));
      }
    },
    input: {
      handler(val) {
        this.$emit("input", val);
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
    composeForm(allProductRelationTypes, reshapedValue) {
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
      this.form = JSON.parse(JSON.stringify(this.formReset));
    },
  },
};
</script>
