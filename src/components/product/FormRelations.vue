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
        v-for="(edge, i) in allProductRelationTypes.edges"
        :key="i"
        class="pb-4"
      >
        <template v-if="edge && edge.node">
          <v-divider></v-divider>
          <v-card-title class="text-h5 capitalize">
            {{ edge.node.plural }}
          </v-card-title>
          <v-card-text class="grey--text" v-if="edge.node.reverse">
            <span>
              <span class="font-italic capitalize">
                {{ edge.node.plural }}
              </span>
              of <span class="font-italic"> {{ name }}. </span>
              <span class="font-italic"> {{ name }} </span>
              will be {{ edge.node.reverse.indefArticle }}
              <span class="font-italic">
                {{ edge.node.reverse.singular }}.
              </span>
            </span>
          </v-card-text>
          <v-container>
            <v-row
              v-for="(e, i) in form[edge.node.typeId]"
              :key="i"
              class="flex-nowrap"
            >
              <v-card-text>
                <v-autocomplete
                  :label="edge.node.singular"
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
                      @click="form[edge.node.typeId].splice(i, 1)"
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
              @click="form[edge.node.typeId].push({ productId: null })"
            >
              Add a field
            </v-btn>
          </v-card-actions>
        </template>
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

<script lang="ts">
import { defineComponent, ref, computed, watch, PropType } from "vue";
import State from "@/utils/LoadingState";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

import QueryForFormRelations from "@/graphql/queries/QueryForFormRelations.gql";
import { QueryForFormRelationsQuery } from "@/generated/graphql";

import { useQuery } from "@urql/vue";

interface Relation {
  productId: string;
  typeId: number;
}

interface Reshaped {
  [key: number]: { productId: string | null }[];
}

function reshapeValue(val: Relation[]): Reshaped {
  if (!val) return {};
  return val.reduce((a, o) => {
    if (o.typeId in a) {
      a[o.typeId].push({ productId: o.productId });
      return a;
    } else {
      return { ...a, [o.typeId]: [{ productId: o.productId }] };
    }
  }, {});
}

export default defineComponent({
  name: "FormRelations",
  components: {
    DevToolLoadingStateOverridingMenu,
  },
  props: {
    value: { type: Array as PropType<Relation[]>, require: true },
    name: { type: String, require: true },
  },
  setup(prop) {
    const query = useQuery<QueryForFormRelationsQuery>({
      query: QueryForFormRelations,
    });
    const allProductRelationTypes = computed(
      () => query.data.value?.allProductRelationTypes || { edges: [] }
    );
    const allProducts = computed(
      () => query.data.value?.allProducts || { edges: [] }
    );
    const init = ref(true);
    const queryError = ref<string | null>(null);
    watch(query.data, (data) => {
      if (data) init.value = false;
    });
    watch(query.error, (e) => {
      init.value = false;
      queryError.value = e?.message || null;
    });
    return {
      query,
      allProductRelationTypes,
      allProducts,
      init,
      queryError,
    };
  },
  data() {
    return {
      form: reshapeValue(this.value || []),
      formReset: null,
      refreshing: false,
      devtoolState: null,
      State: State,
    };
  },
  computed: {
    state() {
      if (this.devtoolState) return this.devtoolState;
      if (this.refreshing) return State.LOADING;
      if (this.query.fetching.value) return State.LOADING;
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
    input(): Relation[] {
      return Object.entries(this.form)
        .reduce((a, e) => {
          const typeId = Number(e[0]);
          const l = e[1].filter((x) => x.productId !== null);
          return [...a, ...l.map((o) => ({ productId: o.productId, typeId }))];
        }, [] as Relation[])
        .sort(
          (a, b) =>
            a.typeId - b.typeId || a.productId.localeCompare(b.productId)
        );
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
      const reshapedValue = this.value ? reshapeValue(this.value) : {};
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
  methods: {
    async refetch() {
      this.refreshing = true;
      const wait = new Promise((resolve) => setTimeout(resolve, 500));
      await this.query.executeQuery({ requestPolicy: "network-only" });
      await wait; // wait until 0.5 sec passes since starting refetch
      // because the progress circular is too flickering if
      // the refetch finishes too quickly
      this.refreshing = false;
    },
    composeForm(allProductRelationTypes, reshapedValue: Reshaped): Reshaped {
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
});
</script>
