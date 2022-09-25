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
      <v-alert v-else-if="error" type="error">{{ error }}</v-alert>
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
    <dev-tool-loading-state-menu
      top="-10px"
      v-model="devtoolState"
    ></dev-tool-loading-state-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, PropType } from "vue";

import QueryForFormRelations from "@/graphql/queries/QueryForFormRelations.gql";
import { QueryForFormRelationsQuery } from "@/generated/graphql";

import { useQuery } from "@urql/vue";

import { useQueryState } from "@/utils/query-state";

interface Relation {
  productId: number;
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
  props: {
    value: Array as PropType<Relation[]>,
    name: { type: String, require: true },
  },
  setup(prop, { emit }) {
    const query = useQuery<QueryForFormRelationsQuery>({
      query: QueryForFormRelations,
    });
    const allProductRelationTypes = computed(
      () => query.data.value?.allProductRelationTypes || { edges: [] }
    );
    watch(allProductRelationTypes, (val) => {
      const reshapedValue = prop.value ? reshapeValue(prop.value) : {};
      form.value = composeForm(val, reshapedValue);
      if (!formReset.value) {
        formReset.value = JSON.parse(JSON.stringify(form.value));
      }
    });
    function composeForm(
      relationTypes: typeof allProductRelationTypes.value,
      reshapedValue: Reshaped
    ): Reshaped {
      return relationTypes.edges.reduce(
        (a, e) =>
          e?.node
            ? {
                ...a,
                [e.node.typeId]: [
                  ...(reshapedValue[e.node.typeId] || []),
                  { productId: null },
                ],
              }
            : a,
        {} as Reshaped
      );
    }
    const allProducts = computed(
      () => query.data.value?.allProducts || { edges: [] }
    );
    const form = ref(reshapeValue(prop.value || []));
    const formReset = ref<typeof form.value | null>(null);
    const unchanged = computed(() =>
      formReset.value === null
        ? false
        : JSON.stringify(form.value) === JSON.stringify(formReset.value)
    );
    const input = computed((): Relation[] =>
      Object.entries(form.value)
        // @ts-ignore
        .reduce((a, e: [string, typeof form.value[number]]) => {
          const typeId = Number(e[0]);
          const l = e[1].filter((x) => x.productId !== null);
          return [...a, ...l.map((o) => ({ productId: o.productId, typeId }))];
        }, [] as Relation[])
        .sort(
          (a, b) =>
            a.typeId - b.typeId || a.productId.localeCompare(b.productId)
        )
    );
    watch(
      input,
      (val) => {
        emit("input", val);
      },
      { deep: true, immediate: true }
    );
    const relationTypeItems = computed(
      // [{ text: relation type name (singular), value: relation type id }]
      // e.g., [{ text: "parent", value: "1" }, { text: "child", value: "2" }];
      () =>
        allProductRelationTypes.value.edges.flatMap((e) =>
          e?.node
            ? {
                text: e.node.singular,
                value: e.node.typeId,
              }
            : []
        )
    );
    const productItems = computed(
      // [{ text: product name (product type name), value: product id }]
      // e.g., [{ text: "Map-01 (map)", value: "1" }, ...];
      () =>
        allProducts.value.edges.map((e) =>
          e?.node
            ? {
                text: `${e.node.name} (${e.node.type_?.singular})`,
                value: Number(e.node.productId),
              }
            : []
        )
    );
    function reset() {
      form.value = JSON.parse(JSON.stringify(formReset.value));
    }
    return {
      ...useQueryState(query),
      query,
      allProductRelationTypes,
      allProducts,
      form,
      formReset,
      unchanged,
      input,
      relationTypeItems,
      productItems,
      reset,
    };
  },
});
</script>
