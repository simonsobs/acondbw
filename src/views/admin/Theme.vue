<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card flat>
          <v-card-title class="text-h4">Theme</v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-for="k in keys" :key="k">
      <v-col cols="6">
        <v-card flat outlined>
          <v-card-title :class="`text-${k}`">
            {{ k }}: {{ colors[k] }}
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card flat :class="`bg-${k}`">
          <v-card-title :class="`bg-on-${k}`">
            {{ `on-${k}` }}: {{ colors[`on-${k}`] }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTheme } from "vuetify";

const keys = ref([
  "primary",
  "secondary",
  "accent",
  "error",
  "info",
  "success",
  "warning",
]);

const keysWithOn = computed(() => [
  ...keys.value,
  ...keys.value.map((k) => `on-${k}`),
]);

const theme = useTheme();

const colors = computed(() =>
  keysWithOn.value.reduce(
    (a, k) => ({ ...a, ...{ [k]: theme.themes.value.light.colors[k] } }),
    {}
  )
);
</script>
