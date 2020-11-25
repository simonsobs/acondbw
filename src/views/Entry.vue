<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="6">
          <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <div class="text-h3">
        {{ title }}
      </div>
    </v-row>
          </v-container>
        <!-- <dashboard></dashboard> -->
      </v-col>
      <v-col cols="6">
        <sign-in></sign-in>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WebConfig from "@/graphql/site/WebConfig.gql";

import SignIn from "@/views/auth/SignIn";
import Dashboard from "@/components/product/Dashboard";

export default {
  name: "Home",
  components: {
    SignIn,
    Dashboard,
  },
  apollo: {
    title: {
      query: WebConfig,
      update: data =>
        data.webConfig ? data.webConfig.toolbarTitle : null,
      result(result) {
        this.error = result.error ? result.error : null;
      }
    }
  },
};
</script>