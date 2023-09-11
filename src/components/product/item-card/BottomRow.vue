<template>
  <v-row
    no-gutters
    align="end"
    justify="space-between"
    class="mt-3"
    style="font-size: 11px"
  >
    <div>
      <div v-if="timeUpdated || node.updatingGitHubUser">
        Updated
        <span v-if="timeUpdated"> at {{ timeUpdated }} </span>
        <span v-if="node.updatingGitHubUser">
          by {{ node.updatingGitHubUser.login }}
        </span>
      </div>
      <div v-if="timePosted || node.postingGitHubUser">
        Posted
        <span v-if="timePosted"> at {{ timePosted }} </span>
        <span v-if="node.postingGitHubUser">
          by {{ node.postingGitHubUser.login }}
        </span>
      </div>
    </div>
    <div>ID: {{ node.id }}</div>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ProductQuery } from "@/graphql/codegen/generated";

type Product = NonNullable<ProductQuery["product"]>;

interface Props {
  node: Product;
}

const prop = defineProps<Props>();

const timePosted = computed(() => formatDateTime(prop.node.timePosted));
const timeUpdated = computed(() => formatDateTime(prop.node.timeUpdated));

function formatDateTime(dateTime: string | undefined | null) {
  if (!dateTime) return null;
  const sinceEpoch = Date.parse(dateTime);
  const format = Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  return format.format(sinceEpoch);
}
</script>
