<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
    <dashboard></dashboard>
    </v-row>
  </v-container>
</template>

<script>
import Dashboard from "@/components/product/Dashboard";

export default {
  name: "Home",
  components: {
    Dashboard
  },
}
</script>