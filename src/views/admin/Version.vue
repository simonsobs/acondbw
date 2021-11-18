<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title class="text-h4">Versions</v-card-title>
          <v-card-text v-if="versions">
            <span class="font-weight-medium"> App version: </span>
            {{ $store.getters.appVersion }} <br />
            <span class="font-weight-medium"> Server version: </span>
            {{ versions.version }} <br />
            <span class="font-weight-medium"> Alembic migration version: </span>
            {{ versions.alembicVersion }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VERSIONS from "@/graphql/queries/Versions.gql";

export default {
  data() {
    return {
      versions: null,
    };
  },
  apollo: {
    versions: {
      query: VERSIONS,
      update: (data) => data,
    },
  },
};
</script>
