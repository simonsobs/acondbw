<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <div>
        <div class="display-2 text-center">This is an about page</div>
        <div class="mt-5 text-center">
          <span class="font-italic font-weight-medium">Server version:</span>
          {{ version }}
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import VERSION from "@/graphql/queries/Version.gql";

export default {
  data() {
    return {
      version: null
    };
  },
  apollo: {
    version: VERSION
  }
};
</script>
