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
      <MapItemCard :map="item" :collapsible="false"></MapItemCard>
    </v-container>
  </div>
</template>

<script>
import Map from "@/graphql/Map.gql";

import MapItemCard from "@/components/MapItemCard";

export default {
  name: "mapItem",
  components: {
    MapItemCard
  },
  data() {
    return {
      item: {}
    };
  },
  apollo: {
    item: {
      query: Map,
      update: data => data.map,
      variables() {
        return {
          name: this.$route.params.name
        }
      }
    }
  }
};
</script>
