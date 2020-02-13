<template>
  <div class="mapitem">
    <v-container>
      <h2>Map</h2>
      <p v-text="$route.params.name"></p>
      <v-card outlined hover style="cursor: default;">
        <v-layout row wrap class="ma-0 px-3">
          <v-flex xs12 md4>
            <div class="caption grey--text">Name</div>
            <div class="font-weight-medium primary--text" v-text="item.name"></div>
          </v-flex>
          <v-flex xs6 md4>
            <div class="caption grey--text">Date posted</div>
            <div v-text="item.datePosted"></div>
          </v-flex>
          <v-flex xs5 md3>
            <div class="caption grey--text">Mapper</div>
            <div v-text="item.mapper"></div>
          </v-flex>
        </v-layout>
        <v-layout row wrap class="mx-0 my-3 px-3">
          <v-flex xs12 md8 offset-md-4>
            <div class="caption grey--text">Note</div>
            <div>
              <ul v-if="item.note">
                <li
                  v-for="(line, index) in item.note.split('\n')"
                  :key="index"
                >{{ line.replace(/^- */, "") }}</li>
              </ul>
            </div>
          </v-flex>
          <v-flex xs12 md8 offset-md-4>
            <div class="caption grey--text">Paths</div>
            <ul v-if="item.mapFilePaths">
              <li
                v-for="(edgep, index) in item.mapFilePaths.edges"
                :key="index"
                v-text="edgep.node.path"
              ></li>
            </ul>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "maps",
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
