<template>
  <layout-baseline></layout-baseline>
  <snackbar></snackbar>
</template>

<script setup lang="ts">
import { useSetTitle } from "./set-title";
import LayoutBaseline from "./LayoutBaseline.vue";
import Snackbar from "@/components/layout/Snackbar.vue";
useSetTitle();
</script>
