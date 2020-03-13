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
      <div v-if="$apollo.queries.map.loading">loading...</div>
      <div v-else-if="error">Error: cannot load data</div>
      <div v-else-if="map">
        <MapItemCard :mapId="map.mapId" :collapsible="false" v-on:deleted="$router.push('/maps')"></MapItemCard>
      </div>
      <div v-else>Nothing to show here.</div>
    </v-container>
  </div>
</template>

<script>
import gql from "graphql-tag";

import MapItemCard from "@/components/MapItemCard";

const GqlMapName = gql`
  query MapIdName($name: String) {
    map(name: $name) {
      id
      mapId
      name
    }
  }
`;

export default {
  name: "mapItem",
  components: {
    MapItemCard
  },
  data() {
    return {
      map: null,
      error: null
    };
  },
  apollo: {
    map: {
      query: GqlMapName,
      variables() {
        return {
          name: this.$route.params.name
        };
      },
      result(result) {
        this.error = null;
        if (result.error) {
          this.error = true;
        }
      }
    }
  }
};
</script>
