<template>
  <div class="maps">
    <v-container class>
      <h2>Maps</h2>
      <div class="d-flex justify-end ma-2">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ on }">
            <v-btn icon @click="showsAny = !showsAny" v-on="on">
              <v-icon>{{ showsAny ? 'mdi-unfold-less-horizontal' : 'mdi-unfold-more-horizontal' }}</v-icon>
            </v-btn>
          </template>
          <span>{{ showsAny ? 'Collapse all' : 'Expand all' }}</span>
        </v-tooltip>
      </div>
      <MapItemCard
        v-for="edge in edges"
        :key="edge.node.id"
        :map="edge.node"
        :show="shows[edge.node.id]"
        v-on:set-show="v => shows[edge.node.id] = v"
      ></MapItemCard>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

import MapItemCard from "@/components/MapItemCard";

export default {
  name: "maps",
  components: {
    MapItemCard
  },
  data() {
    return {
      edges: [],
      shows: {}
    };
  },
  computed: {
    showsAny: {
      get: function() {
        return Object.keys(this.shows).some(i => this.shows[i]);
      },
      set: function(v) {
        for (const k in this.shows) {
          this.shows[k] = v;
        }
      }
    }
  },
  created: function() {
    this.loadData();
  },
  methods: {
    loadData() {
      const url = process.env.VUE_APP_ACONDBS_URL;
      const query = `
        { allMaps(sort: DATE_POSTED_DESC) {
          edges {
            node {
              id
              name
              datePosted
              mapper
              note
              mapFilePaths {
                edges {
                  node {
                    path
                    note
                  }
                }
              }
              beams {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }}
      `;
      axios({
        url: url,
        method: "POST",
        data: {
          query: query
        }
      }).then(response => {
        this.edges = response.data.data.allMaps.edges;
        this.shows = this.edges.reduce(
          (obj, x) => ({ ...obj, [x.node.id]: false }),
          {}
        );
      });
    }
  }
};
</script>
