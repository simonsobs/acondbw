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
import axios from "axios";

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
  watch: {
    $route(to, from) {
      this.item = {};
      this.loadData();
    }
  },
  created: function() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const url = process.env.VUE_APP_ACONDBS_URL;
      const query = `
        query Map($name: String) {
          map(name: $name) {
            mapId
            name
            datePosted
            mapper
            mapFilePaths {
              edges {
                node {
                  path
                  note
                }
              }
            }
            note
            beams {
              edges {
                node {
                  beamId
                  name
                }
              }
            }
          }
        }
      `;
      const variables = { name: this.$route.params.name };
      const response = await axios({
        url: url,
        method: "POST",
        data: {
          query: query,
          variables: variables
        }
      });

      this.item = response.data.data.map;
    }
  }
};
</script>
