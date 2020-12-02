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
        <v-container fill-height fluid>
          <v-row align="center" justify="center">
            <sign-in-card></sign-in-card>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WebConfig from "@/graphql/site/WebConfig.gql";

import SignInCard from "@/components/auth/SignInCard";
import Dashboard from "@/components/product/Dashboard";

export default {
  name: "Home",
  components: {
    SignInCard,
    Dashboard,
  },
  apollo: {
    title: {
      query: WebConfig,
      update: (data) => (data.webConfig ? data.webConfig.toolbarTitle : null),
      result(result) {
        this.error = result.error ? result.error : null;
      },
    },
  },
};
</script>