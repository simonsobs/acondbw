<template>
  <v-container fluid>
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
          <v-card-title :class="`${k}--text`">
            {{ k }}: {{ colors[k] }}
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card flat :class="k">
          <v-card-title :class="`on-${k}--text`">
            {{ `on-${k}` }}: {{ colors[`on-${k}`] }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const KEYS = [
  "primary",
  "secondary",
  "accent",
  "error",
  "info",
  "success",
  "warning",
];

export default {
  name: "Theme",
  data: () => ({ keys: KEYS }),
  computed: {
    colors() {
      const theme = this.$vuetify.theme.themes.light;
      const keys = [...this.keys, ...this.keys.map((k) => `on-${k}`)];
      const ret = keys.reduce((a, k) => ({ ...a, ...{ [k]: theme[k] } }), {});
      return ret;
    },
  },
};
</script>
