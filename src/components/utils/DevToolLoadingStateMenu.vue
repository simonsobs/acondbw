<template>
  <div v-if="enabled">
    <v-menu right bottom offset-y :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-btn absolute :style="buttonStyle" icon v-on="on">
          <v-icon x-small color="grey lighten-1">mdi-nut</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-subheader>Dev Tools</v-subheader>
        <v-list-item-group v-model="state" v-for="item in menuItems">
          <v-list-item :value="item.value">
            <v-list-item-title>{{ item.text }}</v-list-item-title>
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
  name: "DevToolLoadingStateMenu",
  props: {
    value: Number, // for v-model
    top: { default: "-15px" },
    right: { default: "-10px" },
  },
  setup(prop, { emit }) {
    const store = useStore();
    const buttonStyle = computed(() => ({
      top: prop.top,
      right: prop.right,
    }));

    const menuItems = ref([
      { text: "Init", value: State.INIT },
      { text: "Loading", value: State.LOADING },
      { text: "Error", value: State.ERROR },
      { text: "Loaded", value: State.LOADED },
      { text: "Empty", value: State.EMPTY },
      { text: "None", value: State.NONE },
      { text: "Off", value: null },
    ]);

    const enabled = computed(() => store.webConfig.devtoolLoadingstate);
    watch(enabled, (val) => {
      if (!val) state.value = null;
    });
    const state = ref<number | null>(null);
    watch(state, (s) => {
      emit("input", s); // for v-model
    });
    return {
      buttonStyle,
      menuItems,
      enabled,
      state,
      State,
    };
  },
});
</script>
