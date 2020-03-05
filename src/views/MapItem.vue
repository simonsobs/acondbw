<template>
  <div class="mapitem">
    <v-container fluid>
      <h2>Map</h2>
      <div class="d-flex justify-start my-2">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ on }">
            <v-btn text icon exact to="/maps" v-on="on">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>Back to Maps</span>
        </v-tooltip>
      </div>
      <MapItemCard :mapName="mapName" :collapsible="false"></MapItemCard>
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
      mapName: null
    };
  },
  apollo: {
    mapName: {
      query: GqlMapName,
      update: data => data.map.name,
      variables() {
        return {
          name: this.$route.params.name
        };
      }
    }
  }
};
</script>
