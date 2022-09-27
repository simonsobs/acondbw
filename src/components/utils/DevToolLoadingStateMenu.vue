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

<script setup lang="ts">
import { withDefaults, ref, computed, watch } from "vue";
import { useConfig } from "@/utils/config";

import State from "@/utils/LoadingState";

interface Props {
  value?: Number;
  top?: string;
  right?: string;
}

const props = withDefaults(defineProps<Props>(), {
  top: "-15px",
  right: "-10px",
});

interface Emits {
  (e: "input", value: number | null): void;
}

const emit = defineEmits<Emits>();

const buttonStyle = computed(() => ({
  top: props.top,
  right: props.right,
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

const config = useConfig();
const enabled = computed(() => config.config?.value.devtoolLoadingstate);
watch(enabled, (val) => {
  if (!val) state.value = null;
});
const state = ref<number | null>(null);
watch(state, (s) => {
  emit("input", s); // for v-model
});
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({ name: "DevToolLoadingStateMenu" });
</script>
