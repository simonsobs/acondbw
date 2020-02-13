<template>
  <div class="maps">
    <v-container class>
      <h2>Beams</h2>
      <div class="d-flex justify-end ma-2">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ on }">
            <v-btn icon @click="areAllCardsCollapsed = !areAllCardsCollapsed" v-on="on">
              <v-icon>{{ areAllCardsCollapsed ? 'mdi-unfold-more-horizontal' : 'mdi-unfold-less-horizontal' }}</v-icon>
            </v-btn>
          </template>
          <span>{{ areAllCardsCollapsed ? 'Expand all' : 'Collapse all' }}</span>
        </v-tooltip>
      </div>
      <v-card outlined hover v-for="edge in edges" :key="edge.node.id" style="cursor: default;">
        <div @click="isCardCollapsed[edge.node.id] = !isCardCollapsed[edge.node.id]">
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
              <v-layout justify-end>
                <v-tooltip bottom open-delay="800">
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon>{{ isCardCollapsed[edge.node.id] ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ isCardCollapsed[edge.node.id] ? 'Expand' : 'Collapse' }}</span>
                </v-tooltip>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-expand-transition>
            <v-layout row wrap class="mx-0 my-3 px-3" v-show="!isCardCollapsed[edge.node.id]">
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
      edges: [],
      isCardCollapsed: {}
    };
  },
  computed: {
    areAllCardsCollapsed: {
      get: function() {
        return Object.keys(this.isCardCollapsed).every(
          i => this.isCardCollapsed[i]
        );
      },
      set: function(v) {
        for (const k in this.isCardCollapsed) {
          this.isCardCollapsed[k] = v;
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
        this.isCardCollapsed = this.edges.reduce(
          (obj, x) => ({ ...obj, [x.node.id]: true }),
          {}
        );
      });
    }
  }
};
</script>
