<template>
  <div v-if="count === 0" class="text-body-2">None</div>
  <ul>
    <li v-for="(p, index) in paths" :key="index" v-text="p"></li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ProductQuery } from "@/graphql/codegen/generated";

type Paths = NonNullable<NonNullable<ProductQuery["product"]>["paths"]>;

interface Props {
  paths: Paths;
}

const prop = defineProps<Props>();

const count = computed(() => prop.paths.edges.length);

const paths = computed(() =>
  prop.paths.edges.flatMap((edge) => edge?.node?.path || [])
);
</script>
