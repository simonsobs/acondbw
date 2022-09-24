<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title class="text-h4">Versions</v-card-title>
          <v-card-text v-if="versions">
            <span class="font-weight-medium"> App version: </span>
            {{ appVersion }} <br />
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

<script setup lang="ts">
import { ref } from "vue"
import { useStore } from "@/stores/main";
import { useVersionsQuery } from "@/generated/graphql";
const store = useStore();
const appVersion = ref(store.appVersion);
const query = useVersionsQuery();
const versions = query.data;
</script>
