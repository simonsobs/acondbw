<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title class="text-h4">Log</v-card-title>
          <v-data-table
            v-if="allLogs"
            :headers="headers"
            :items="allLogs.edges"
            :items-per-page="allLogs.totalCount"
            :hide-default-footer="true"
            item-key="node.id_"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            show-expand
          >
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <pre>{{ item.node.message }}</pre>
              </td>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
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

<script>
import ALL_LOGS from "@/graphql/queries/AllLogs.gql";

import LogRemoveForm from "@/components/admin/LogRemoveForm.vue";

export default {
  name: "Log",
  components: { LogRemoveForm },
  data() {
    return {
      allLogs: null,
      expanded: [],
      singleExpand: false,
      headers: [
        { text: "Time", value: "node.time", align: "start" },
        { text: "Level", value: "node.level", align: "start" },
        { text: "", value: "data-table-expand" },
        { text: "", value: "actions", sortable: false, align: "end" },
      ],
      dialogRemove: false,
      removeId: null,
    };
  },
  apollo: {
    allLogs: {
      query: ALL_LOGS,
      result(result) {
        result.data.allLogs.edges.forEach((e) => {
          e.node.time = this.formatDateTime(e.node.time);
        });
      },
    },
  },
  methods: {
    formatDateTime(dateTime) {
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
    },
    removeFormCanceled() {
      this.closeRemoveForm();
    },
    removeFormFinished() {
      this.$apollo.queries.allLogs.refetch();
      this.closeRemoveForm();
    },
    closeRemoveForm() {
      this.dialogRemove = false;
      this.$nextTick(() => {
        this.removeLogin = null;
      });
    },
    openRemoveForm(item) {
      this.removeId = Number(item.node.id_);
      this.dialogRemove = true;
    },
  },
};
</script>
