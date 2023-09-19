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
    <v-progress-circular
      v-if="loading"
      indeterminate
      :size="26"
      color="secondary"
    ></v-progress-circular>
    <v-alert v-else-if="error" variant="tonal" type="error">
      {{ error }}
    </v-alert>
    <loaded
      v-else-if="loaded"
      :model-value="prop.modelValue"
      @update:modelValue="
        ($event) => {
          $emit('update:modelValue', $event);
        }
      "
      :name="name"
      :allProductRelationTypes="allProductRelationTypes"
      :allProducts="allProducts"
    >
    </loaded>
    <dev-tool-loading-state-menu top="10px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQueryForFormRelationsQuery } from "@/graphql/codegen/generated";
import { useQueryState } from "@/utils/query-state";
import Loaded from "./Loaded.vue";

interface Relation {
  productId: number;
  typeId: number;
}

interface Props {
  modelValue: Relation[] | null;
  name: string;
}

type Emits = {
  "update:modelValue": [input: Relation[]];
};

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const query = useQueryForFormRelationsQuery();

const allProductRelationTypes = computed(
  () => query.data.value?.allProductRelationTypes || { edges: [] }
);

const allProducts = computed(
  () => query.data.value?.allProducts || { edges: [] }
);

const { loading, error, loaded, devtoolState } = useQueryState(query);
</script>
