<template>
  <v-container fill-height fluid style="align-items: stretch">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <div class="text-h3 text-center">
          {{ title }}
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <v-container fill-height fluid>
          <v-row align="center" justify="center">
            <v-col style="flex: 0">
              <sign-in-card></sign-in-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WebConfig from "@/graphql/queries/WebConfig.gql";

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