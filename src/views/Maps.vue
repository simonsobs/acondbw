<template>
  <div class="maps">
    <v-container fluid>
      <h2>Maps</h2>
      <MapSubmitFormDialog></MapSubmitFormDialog>
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
import MapSubmitFormDialog from "@/components/MapSubmitFormDialog";

export default {
  name: "maps",
  components: {
    MapItemCard,
    MapSubmitFormDialog
  },
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
