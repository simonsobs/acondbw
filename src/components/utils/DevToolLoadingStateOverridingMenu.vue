<template>
  <div v-if="enabled">
    <v-menu right bottom offset-y :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-btn absolute style="top: -15px; right: -10px" icon v-on="on">
          <v-icon x-small color="grey lighten-1">mdi-nut</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-subheader>Dev Tools</v-subheader>
        <v-list-item-group v-model="state">
          <v-list-item :value="State.INIT">
            <v-list-item-title>Init</v-list-item-title>
          </v-list-item>
          <v-list-item :value="State.LOADING">
            <v-list-item-title>Loading</v-list-item-title>
          </v-list-item>
          <v-list-item :value="State.ERROR">
            <v-list-item-title>Error</v-list-item-title>
          </v-list-item>
          <v-list-item :value="State.LOADED">
            <v-list-item-title>Loaded</v-list-item-title>
          </v-list-item>
          <v-list-item :value="State.EMPTY">
            <v-list-item-title>Empty</v-list-item-title>
          </v-list-item>
          <v-list-item :value="State.NONE">
            <v-list-item-title>None</v-list-item-title>
          </v-list-item>
          <v-list-item :value="null">
            <v-list-item-title>Off</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { useStore } from "@/stores/main";

import State from "@/utils/LoadingState";

export default defineComponent({
  name: "DevToolLoadingStateOverridingMenu",
  props: { value: Number }, // for v-model
  setup(prop, { emit }) {
    const store = useStore();
    const enabled = computed(() => store.webConfig.devtoolLoadingstate);
    watch(enabled, (val) => {
      if (!val) state.value = null;
    });
    const state = ref<number | null>(null);
    watch(state, (s) => {
      emit("state", s);
      emit("input", s); // for v-model
    });
    return {
      enabled,
      state,
      State,
    };
  },
});
</script>
