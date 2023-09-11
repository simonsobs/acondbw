<template>
  <div v-if="enabled">
    <v-menu right bottom offset-y :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="plain"
          density="compact"
          size="x-small"
          :style="buttonStyle"
          icon="mdi-nut"
        >
        </v-btn>
      </template>
      <v-list dense v-model:selected="selected">
        <v-list-subheader>Dev Tools</v-list-subheader>
        <v-list-item
          :value="item.value"
          :title="item.text"
          v-for="item in menuItems"
        >
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, ref, computed, watch } from "vue";
import { useConfigStore } from "@/plugins/pinia/stores/config";

import State from "@/utils/LoadingState";

interface Props {
  modelValue: State;
  top?: string;
  right?: string;
}

const props = withDefaults(defineProps<Props>(), {
  top: "-15px",
  right: "-10px",
});

interface Emits {
  (e: "update:modelValue", value: State): void;
}

const emit = defineEmits<Emits>();

const buttonStyle = computed(() => ({
  position: "absolute",
  top: props.top,
  right: props.right,
}));

const menuItems = ref([
  { text: "Init", value: State.Init },
  { text: "Loading", value: State.Loading },
  { text: "Error", value: State.Error },
  { text: "Loaded", value: State.Loaded },
  { text: "Empty", value: State.Empty },
  { text: "None", value: State.None },
  { text: "Off", value: State.Off },
]);

const selected = ref([State.Off]);
const state = computed(() => selected.value[0]);

const configStore = useConfigStore();

const enabled = computed(() => configStore.config.devtoolLoadingstate);

watch(enabled, (val) => {
  if (!val) selected.value = [State.Off];
});

watch(state, (s) => {
  emit("update:modelValue", s);
});
</script>
