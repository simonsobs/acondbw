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
      <MapItemCard :mapName="map.name" :collapsible="false" v-if="map"></MapItemCard>
    </v-container>
  </div>
</template>

<script>
import gql from "graphql-tag";

import MapItemCard from "@/components/MapItemCard";

const GqlMapName = gql`
  query Map($name: String) {
    map(name: $name) {
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
      map: null
    };
  },
  apollo: {
    map: {
      query: GqlMapName,
      variables() {
        return {
          name: this.$route.params.name
        }
      }
    }
  }
};
</script>
