<template>
  <v-navigation-drawer v-model="drawer">
    <div class="navigation ma-2" style="position: relative">
      <v-list>
        <v-list-item
          v-for="(link, index) in links"
          :key="index"
          :to="link.to"
          :prepend-icon="link.icon"
          color="primary"
          rounded="lg"
        >
          <v-list-item-title
            v-text="link.title"
            class="capitalize condensed-font"
          ></v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch, watchEffect } from "vue";

interface Props {
  modelValue?: boolean;
}
interface Emits {
  (event: "update:modelValue", value: boolean): void;
}
const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const drawer = ref(props.modelValue);
watchEffect(() => {
  drawer.value = props.modelValue;
});
watch(drawer, (val) => {
  emit("update:modelValue", val);
});

const links = reactive([
  {
    title: "versions",
    to: { name: "AdminVersion" },
    icon: "mdi-scatter-plot-outline",
  },
  {
    title: "log",
    to: { name: "AdminLog" },
    icon: "mdi-exclamation-thick",
  },
  {
    title: "config",
    to: { name: "AdminConfig" },
    icon: "mdi-cog",
  },
  {
    title: "theme",
    to: { name: "AdminTheme" },
    icon: "mdi-format-color-fill",
  },
  {
    title: "users",
    to: { name: "AdminUser" },
    icon: "mdi-account-multiple",
  },
  {
    title: "product types",
    to: { name: "ProductType" },
    icon: "mdi-shape",
  },
]);
</script>
