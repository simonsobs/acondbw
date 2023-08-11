<template>
  <div class="pt-5 px-5" style="max-width: 960px; margin: auto">
    <div class="text-h4 text-primary">Versions</div>
    <v-table class="mt-5">
      <tbody>
        <tr v-for="item in items" :key="item.key">
          <td class="font-weight-medium">{{ item.key }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "@/stores/main";
import { useVersionsQuery } from "@/generated/graphql";
const store = useStore();
const appVersion = ref(store.appVersion);
const query = useVersionsQuery();
const versions = query.data;

const items = computed(() => [
  {
    key: "App version",
    value: appVersion.value,
  },
  {
    key: "Server version",
    value: versions.value?.version,
  },
  {
    key: "Alembic migration version",
    value: versions.value?.alembicVersion,
  },
]);
</script>
