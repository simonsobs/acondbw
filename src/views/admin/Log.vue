<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title class="text-h4">Log</v-card-title>
          <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="items.length"
            :hide-default-footer="true"
            item-key="node.id_"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            show-expand
          >
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <pre>{{ item.message }}</pre>
              </td>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="openRemoveForm(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogRemove" max-width="500px">
      <log-remove-form
        :id_="removeId"
        @cancel="removeFormCanceled"
        @finished="removeFormFinished"
      ></log-remove-form>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import { useQuery } from "@urql/vue";

import ALL_LOGS from "@/graphql/queries/AllLogs.gql";
import { AllLogsQuery } from "@/generated/graphql";

import LogRemoveForm from "@/components/admin/LogRemoveForm.vue";

import { useQueryState } from "@/utils/query-state";

const query = useQuery<AllLogsQuery>({ query: ALL_LOGS });

const queryState = useQueryState(query, {
  isEmpty: () => readItems(query).length === 0,
});

const { loading, error, empty } = queryState;

type Query = typeof query;

function readEdges(query: Query) {
  const edgesAndNulls = query.data?.value?.allLogs?.edges;
  if (!edgesAndNulls) return [];
  return edgesAndNulls.flatMap((e) => (e ? [e] : []));
}

function readItems(query: Query) {
  return readEdges(query).flatMap((e) => (e.node ? e.node : []));
}

const items_ = computed(() =>
  loading.value || empty.value ? [] : readItems(query)
);

const items = computed(() => {
  return items_.value.map((item) => ({
    ...item,
    time: item.time ? formatDateTime(item.time) : "",
  }));
});

function formatDateTime(dateTime: string) {
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

const headers = ref([
  { title: "Time", key: "time", align: "start" },
  { title: "Level", key: "level", align: "start" },
  { title: "", key: "data-table-expand" },
  { title: "", key: "actions", sortable: false, align: "end" },
]);

const dialogRemove = ref(false);
const removeId = ref<number | null>(null);

function removeFormCanceled() {
  closeRemoveForm();
}

function removeFormFinished() {
  query.executeQuery();
  closeRemoveForm();
}

function closeRemoveForm() {
  dialogRemove.value = false;
  nextTick(() => {
    removeId.value = null;
  });
}

function openRemoveForm(item: (typeof items.value)[0]) {
  removeId.value = Number(item.id_);
  dialogRemove.value = true;
}
</script>
