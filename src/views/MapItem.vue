<template>
  <div class="mapitem">
    <v-container>
      <h2>Map</h2>
      <p v-text="$route.params.name"></p>
      <MapItemCard
        :map="item"
        collapsible="false"
      ></MapItemCard>
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
  created: function() {
    this.loadData();
  },
  methods: {
    loadData() {
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
      axios({
        url: url,
        method: "POST",
        data: {
          query: query,
          variables: variables
        }
      }).then(response => {
        this.item = response.data.data.map;
      });
    }
  }
};
</script>
