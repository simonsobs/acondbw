<template>
  <div class="maps">
    <v-container fluid>
      <h2>Maps</h2>
      <template>
        <v-row class="ma-2" justify="left">
          <v-dialog v-model="dialog" persistent max-width="600">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" v-on="on">Add</v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">Add a map</v-card-title>
              <v-card-text>
                <v-form>
                    <v-text-field label="Name"></v-text-field>
                    <v-text-field label="Mapper"></v-text-field>
                </v-form>                
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" text @click="dialog = false">Cancel</v-btn>
                <v-btn color="primary" @click="dialog = false">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </template>
      <div class="d-flex justify-end ma-2">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              @click="areAllCardsCollapsed = !areAllCardsCollapsed"
              v-on="on"
            >
              <v-icon>{{
                areAllCardsCollapsed
                  ? "mdi-unfold-more-horizontal"
                  : "mdi-unfold-less-horizontal"
              }}</v-icon>
            </v-btn>
          </template>
          <span>{{
            areAllCardsCollapsed ? "Expand all" : "Collapse all"
          }}</span>
        </v-tooltip>
      </div>
      <MapItemCard
        v-for="edge in edges"
        :key="edge.node.id"
        :map="edge.node"
        collapsible="true"
        :collapsed="isCardCollapsed[edge.node.id]"
        v-on:expand="isCardCollapsed[edge.node.id] = false"
        v-on:collapse="isCardCollapsed[edge.node.id] = true"
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
      dialog: false,
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
        this.isCardCollapsed = this.edges.reduce(
          (obj, x) => ({ ...obj, [x.node.id]: true }),
          {}
        );
      });
    }
  }
};
</script>
