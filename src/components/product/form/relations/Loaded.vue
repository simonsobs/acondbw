<template>
  <div class="pb-5">
    <div
      v-for="(edge, i) in allProductRelationTypes.edges"
      :key="i"
      class="pb-4"
    >
      <template v-if="edge && edge.node">
        <v-divider></v-divider>
        <v-card-title class="text-h5">
          <span class="capitalize">{{ edge.node.plural }}</span>
        </v-card-title>
        <v-card-text v-if="edge.node.reverse">
          <span>
            <span class="font-italic capitalize">
              {{ edge.node.plural }}
            </span>
            of <span class="font-italic"> {{ name }}. </span>
            <span class="font-italic"> {{ name }} </span>
            will be {{ edge.node.reverse.indefArticle }}
            <span class="font-italic"> {{ edge.node.reverse.singular }}. </span>
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
                :label="edge.node.singular ?? ''"
                :items="productItems"
                variant="outlined"
                clearable
                hide-details
                hide-no-data
                v-model="e.productId"
              ></v-autocomplete>
            </v-card-text>
            <v-card-actions>
              <v-tooltip>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    @click="form[edge.node.typeId].splice(i, 1)"
                    v-bind="props"
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
            variant="text"
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
    <v-btn
      color="secondary"
      :disabled="unchanged"
      variant="text"
      @click="reset"
    >
      Reset
    </v-btn>
  </v-card-actions>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

import type { QueryForFormRelationsQuery } from "@/graphql/codegen/generated";

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

interface Props {
  modelValue: Relation[] | null;
  name: string;
  allProductRelationTypes: NonNullable<
    QueryForFormRelationsQuery["allProductRelationTypes"]
  >;
  allProducts: NonNullable<QueryForFormRelationsQuery["allProducts"]>;
}

type Emits = {
  "update:modelValue": [input: Relation[]];
};

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref(reshapeValue(prop.modelValue || []));
const formReset = ref<typeof form.value | null>(null);

const unchanged = computed(() =>
  formReset.value === null
    ? false
    : JSON.stringify(form.value) === JSON.stringify(formReset.value)
);

const input = computed((): Relation[] =>
  Object.entries(form.value)
    // @ts-ignore
    .reduce((a, e: [string, (typeof form.value)[number]]) => {
      const typeId = Number(e[0]);
      const l = e[1].filter((x) => x.productId !== null);
      return [...a, ...l.map((o) => ({ productId: o.productId, typeId }))];
    }, [] as Relation[])
    .sort((a, b) => a.typeId - b.typeId || a.productId - b.productId)
);

watch(
  input,
  (val) => {
    emit("update:modelValue", val);
  },
  { deep: true, immediate: true }
);

const allProductRelationTypes = computed(() => prop.allProductRelationTypes);

watch(
  allProductRelationTypes,
  (val) => {
    const reshapedValue = reshapeValue(input.value);
    form.value = composeForm(val, reshapedValue);
    if (!formReset.value) {
      formReset.value = JSON.parse(JSON.stringify(form.value));
    }
  },
  { immediate: true }
);

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

const allProducts = computed(() => prop.allProducts);

const productItems = computed(
  // [{ text: product name (product type name), value: product id }]
  // e.g., [{ text: "Map-01 (map)", value: "1" }, ...];
  () =>
    allProducts.value.edges.map((e) =>
      e?.node
        ? {
            title: `${e.node.name} (${e.node.type_?.singular})`,
            value: Number(e.node.productId),
          }
        : []
    )
);
function reset() {
  form.value = JSON.parse(JSON.stringify(formReset.value));
}
</script>
