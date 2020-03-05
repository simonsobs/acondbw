<template>
  <div class="maps">
    <v-container fluid>
      <h2>Maps</h2>
      <MapSubmitFormDialog></MapSubmitFormDialog>
      <div class="d-flex justify-end ma-2">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ on }">
            <v-btn icon @click="areAllCardsCollapsed = !areAllCardsCollapsed" v-on="on">
              <v-icon>
                {{
                areAllCardsCollapsed
                ? "mdi-unfold-more-horizontal"
                : "mdi-unfold-less-horizontal"
                }}
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{
            areAllCardsCollapsed ? "Expand all" : "Collapse all"
            }}
          </span>
        </v-tooltip>
      </div>
      <template v-if="allMaps">
        <MapItemCard
          v-for="edge in allMaps.edges"
          :key="edge.node.id"
          :mapName="edge.node.name"
          collapsible="true"
          :collapsed="isCardCollapsed[edge.node.id]"
          v-on:expand="isCardCollapsed[edge.node.id] = false"
          v-on:collapse="isCardCollapsed[edge.node.id] = true"
        ></MapItemCard>
      </template>
    </v-container>
  </div>
</template>

<script>
import gql from "graphql-tag";

import MapItemCard from "@/components/MapItemCard";
import MapSubmitFormDialog from "@/components/MapSubmitFormDialog";

const GqlAllMaps = gql`
  query AllMaps {
    allMaps(sort: DATE_POSTED_DESC) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export default {
  name: "maps",
  components: {
    MapItemCard,
    MapSubmitFormDialog
  },
  data() {
    return {
      allMaps: null,
      isCardCollapsed: {}
    };
  },
  apollo: {
    allMaps: {
      query: GqlAllMaps,
      result() {
        this.isCardCollapsed = this.allMaps.edges.reduce(
          (obj, x) => ({ ...obj, [x.node.id]: true }),
          {}
        );
      }
    }
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
  }
};
</script>
