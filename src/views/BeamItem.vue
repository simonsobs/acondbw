<template>
  <div class="beamitem">
    <v-container>
      <h2>Beam</h2>
      <p v-text="$route.params.name"></p>
      <v-card outlined hover style="cursor: default;">
        <v-layout row wrap class="ma-0 px-3">
          <v-flex xs12 md3>
            <div class="caption grey--text">Name</div>
            <div class="font-weight-medium primary--text" v-text="item.name"></div>
          </v-flex>
          <v-flex xs11 md8>
            <div class="caption grey--text">Path</div>
            <div v-text="item.path"></div>
          </v-flex>
        </v-layout>
        <v-layout row wrap class="mx-0 my-3 px-3">
          <v-flex xs12 md4 offset-md-3>
            <div class="caption grey--text">Map</div>
            <div v-if="item.map" v-text="item.map.name"></div>
          </v-flex>
          <v-flex xs12 md4>
            <div class="caption grey--text">Parent Beam</div>
            <div v-if="item.parentBeam" v-text="item.parentBeam.name"></div>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "beamItem",
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
        query Beam($name: String) {
          beam(name: $name) {
            beamId
            name
            path
            map {
              name
            }
            parentBeam {
              name
            }
          }
        }
      `;
      const variables = { name: this.$route.params.name }
      axios({
        url: url,
        method: "POST",
        data: {
          query: query,
          variables: variables
        }
      }).then(response => {
        this.item = response.data.data.beam;
      });
    }
  }
};
</script>
