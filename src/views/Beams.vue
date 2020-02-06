<template>
  <div class="maps">
    <v-container class>
      <h2>Beams</h2>
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
      <v-card outlined hover v-for="edge in edges" :key="edge.node.id">
        <div @click="shows[edge.node.id] = !shows[edge.node.id]">
          <v-layout row wrap class="ma-0 px-3">
            <v-flex xs12 md3>
              <div class="caption grey--text">Name</div>
              <div class="font-weight-medium primary--text" v-text="edge.node.name"></div>
            </v-flex>
            <v-flex xs11 md8>
              <div class="caption grey--text">Path</div>
              <div v-text="edge.node.path"></div>
            </v-flex>
            <v-flex xs1 md1 align-self-end>
              <v-btn icon>
                <v-icon>{{ shows[edge.node.id] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-expand-transition>
            <v-layout row wrap class="mx-0 my-3 px-3" v-show="shows[edge.node.id]">
              <v-flex xs12 md4 offset-md-3>
                <div class="caption grey--text">Map</div>
                <div v-if="edge.node.map" v-text="edge.node.map.name"></div>
              </v-flex>
              <v-flex xs12 md4>
                <div class="caption grey--text">Parent Beam</div>
                <div v-if="edge.node.parentBeam" v-text="edge.node.parentBeam.name"></div>
              </v-flex>
            </v-layout>
          </v-expand-transition>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "beams",
  data() {
    return {
      headers: [],
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
      const url = "http://localhost:5000/graphql";
      // const url = "https://actexperiment.info/products/api/graphql";
      const query = `
        { allBeams(sort: NAME_DESC) {
          edges {
            node {
              id
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
        }}
      `;
      axios({
        url: url,
        method: "POST",
        data: {
          query: query
        }
      }).then(response => {
        this.edges = response.data.data.allBeams.edges;
        this.shows = this.edges.reduce(
          (obj, x) => ({ ...obj, [x.node.id]: false }),
          {}
        );
      });
    }
  }
};
</script>
