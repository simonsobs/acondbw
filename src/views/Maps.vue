<template>
  <div class="maps">
    <v-container fluid>
      <h2>Maps</h2>
      <MapSubmitFormDialog></MapSubmitFormDialog>
      <div class="d-flex justify-end ma-2" style="max-width: 980px;">
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
      <transition name="fade" mode="out-in">
        <div v-if="$apollo.queries.allMaps.loading">loading...</div>
        <div v-else-if="error">Error: cannot load data</div>
        <div v-else-if="allMaps">
          <div v-if="allMaps.edges && allMaps.edges.length">
            <MapItemCard
              v-for="edge in allMaps.edges"
              :key="edge.node.id"
              :mapName="edge.node.name"
              collapsible="true"
              :collapsed="isCardCollapsed[edge.node.id]"
              v-on:expand="isCardCollapsed[edge.node.id] = false"
              v-on:collapse="isCardCollapsed[edge.node.id] = true"
            ></MapItemCard>
          </div>
          <div v-else>Nothing to show here.</div>
        </div>
        <div v-else></div>
      </transition>
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
      isCardCollapsed: {},
      error: null
    };
  },
  apollo: {
    allMaps: {
      query: GqlAllMaps,
      result(result) {
        this.error = null;
        if (result.error) {
          this.error = true;
        }
      }
    }
  },
  watch: {
    allMaps: function() {
      if (this.allMaps == undefined) {
        return;
      }
      for (const edge of this.allMaps.edges) {
        const id = edge.node.id;
        if (!(id in this.isCardCollapsed)) {
          this.isCardCollapsed = {
            ...this.isCardCollapsed,
            [id]: true
          };
          // The above line of the code adds a new element {id: true} to
          // the object this.isCardCollapsed in the way that the new
          // element will be a reactive object of Vue. The commented out
          // code below is simpler but the new element won't be reactive.
          // this.isCardCollapsed[id] = true;
        }
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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
