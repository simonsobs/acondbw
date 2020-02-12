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
      <v-card outlined hover v-for="edge in edges" :key="edge.node.id">
        <div @click="shows[edge.node.id] = true" style="cursor: default;">
          <v-layout row wrap class="ma-0 px-3">
            <v-flex xs12 md4>
              <div class="caption grey--text">Name</div>
              <div class="font-weight-medium primary--text">
                <span @click.stop>
                  <router-link :to="'/maps/item/' + edge.node.name" v-text="edge.node.name"></router-link>
                </span>
              </div>
            </v-flex>
            <v-flex xs6 md4>
              <div class="caption grey--text">Date posted</div>
              <div v-text="edge.node.datePosted"></div>
            </v-flex>
            <v-flex xs5 md3>
              <div class="caption grey--text">Mapper</div>
              <div v-text="edge.node.mapper"></div>
            </v-flex>
            <v-flex xs1 md1 align-self-end>
              <v-btn icon @click.stop="shows[edge.node.id] = !shows[edge.node.id]">
                <v-icon>{{ shows[edge.node.id] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-expand-transition>
            <v-layout row wrap class="mx-0 mb-3 px-3" v-show="shows[edge.node.id]">
              <v-flex xs12 md8 offset-md-4>
                <div class="caption grey--text">Paths</div>
                <ul>
                  <li
                    v-for="(edgep, index) in edge.node.mapFilePaths.edges"
                    :key="index"
                    v-text="edgep.node.path"
                  ></li>
                </ul>
              </v-flex>
              <v-flex xs12 md8 offset-md-4>
                <div class="caption grey--text">Note</div>
                <div>
                  <ul>
                    <li
                      v-for="(line, index) in edge.node.note.split('\n')"
                      :key="index"
                    >{{ line.replace(/^- */, "") }}</li>
                  </ul>
                </div>
              </v-flex>
              <v-flex xs12 md8 offset-md-4>
                <div class="caption grey--text">Beams</div>
                <ul>
                  <li
                    v-for="(edgep, index) in edge.node.beams.edges"
                    :key="index"
                  >
                    <router-link :to="'/beams/item/' + edgep.node.name" v-text="edgep.node.name"></router-link>
                  </li>
                </ul>
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
  name: "maps",
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
