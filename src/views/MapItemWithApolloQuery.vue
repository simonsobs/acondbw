<!--

This component is a version of MapItem.vue with ApolloQuery.
ApolloQuery is described at
https://apollo.vuejs.org/guide/components/query.html.

It works but is not used because it is not clear how to test. The test
fails with the following message.

  Test suite failed to run

    Tagged template strings are not supported. Use `transforms: {
    templateString: false }` to skip transformation and disable this
    error, or `transforms: { dangerousTaggedTemplateString: true }` if
    you know what you're doing (1:556)

The problem is discussed in the issue
https://github.com/vuejs/vue-jest/issues/98. The issue is still open
as of this writing and a solution is unknown.

-->

<template>
  <div class="mapitem">
    <v-container fluid>
      <h2>Map</h2>
      <div class="d-flex justify-start my-2" style="max-width: 980px;">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ on }">
            <v-btn text icon exact to="/maps" v-on="on">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>Back to Maps</span>
        </v-tooltip>
      </div>
      <ApolloQuery
        :query="gql => gql`
          query Mapp($name: String) {
            map(name: $name) {
              mapId
              name
            }
          }
      `"
        :variables="{ name: $route.params.name }"
      >
        <template v-slot="{ result: { loading, error, data }, isLoading }">
          <!-- 
            "loading" appears to be always "false".
            use "isLoading" as described in the issue
            https://github.com/vuejs/vue-apollo/issues/263
          -->
          <div v-if="isLoading">loading...</div>
          <div v-else-if="error">Error: cannot load data</div>
          <div v-else-if="data.map">
            {{ data.map }}
            <MapItemCard :mapName="data.map.name" :collapsible="false"></MapItemCard>
          </div>
          <div v-else>Nothing to show here.</div>
        </template>
      </ApolloQuery>
    </v-container>
  </div>
</template>

<script>
import MapItemCard from "@/components/MapItemCard";

export default {
  name: "mapItem",
  components: {
    MapItemCard
  }
};
</script>
