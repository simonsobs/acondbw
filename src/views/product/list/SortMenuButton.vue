<template>
  <v-tooltip>
    <template v-slot:activator="{ props: tooltip }">
      <v-menu left offset-y>
        <template v-slot:activator="{ props: menu }">
          <v-btn v-bind="{ ...tooltip, ...menu }" variant="text" icon>
            <v-icon icon="mdi-sort-variant"></v-icon>
          </v-btn>
        </template>
        <v-list flat dense v-model:selected="sortSelected">
          <v-list-item title="Sort"> </v-list-item>
          <v-list-item
            v-for="(item, i) in sortItems"
            :key="i"
            :value="item"
            :title="item.title"
          >
            <template v-slot:prepend>
              <v-icon v-if="item == sortItem" icon="mdi-check"> </v-icon>
              <v-icon v-else> </v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <span>Sort</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { ProductSortEnum } from "@/generated/graphql";

interface Props {
  modelValue: ProductSortEnum[];
}

interface Emits {
  (event: "update:modelValue", value: ProductSortEnum[]): void;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const sortItems = ref([
  { title: "Recently posted", value: ProductSortEnum.TimePostedDesc },
  { title: "Recently updated", value: ProductSortEnum.TimeUpdatedDesc },
  { title: "Name", value: ProductSortEnum.NameAsc },
]);
const sortSelected = ref([sortItems.value[0]]);
watchEffect(() => {
  if (prop.modelValue.length > 0) {
    if (prop.modelValue[0] !== sortSelected.value[0].value) {
      const sortItem = sortItems.value.find(
        (item) => item.value === prop.modelValue[0]
      );
      if (sortItem) sortSelected.value = [sortItem];
    }
  }
});
const sortItem = computed(() => sortSelected.value[0]);
const sort = computed(() => [sortItem.value.value]);
watchEffect(() => emit("update:modelValue", sort.value));
</script>
