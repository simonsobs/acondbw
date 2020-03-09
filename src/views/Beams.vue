<template>
  <div class="maps">
    <v-container fluid>
      <h2>Beams</h2>
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
      <div v-if="$apollo.queries.allBeams.loading">loading...</div>
      <div v-else-if="error">Error: cannot load data</div>
      <div v-else-if="allBeams">
        <div v-if="allBeams.edges && allBeams.edges.length">
          <BeamItemCard
            v-for="edge in allBeams.edges"
            :key="edge.node.id"
            :beamName="edge.node.name"
            collapsible="true"
            :collapsed="isCardCollapsed[edge.node.id]"
            v-on:expand="isCardCollapsed[edge.node.id] = false"
            v-on:collapse="isCardCollapsed[edge.node.id] = true"
          ></BeamItemCard>
        </div>
        <div v-else>Nothing to show here.</div>
      </div>
      <div v-else></div>
    </v-container>
  </div>
</template>

<script>
import gql from "graphql-tag";

import BeamItemCard from "@/components/BeamItemCard";

const GqlAllBeams = gql`
  query AllBeams {
    allBeams(sort: NAME_DESC) {
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
  name: "beams",
  components: {
    BeamItemCard
  },
  data() {
    return {
      allBeams: null,
      isCardCollapsed: {},
      error: null
    };
  },
  apollo: {
    allBeams: {
      query: GqlAllBeams,
      result(result) {
        this.error = null;
        if (result.error) {
          this.error = true;
        }
      }
    }
  },
  watch: {
    allBeams: function() {
      if (this.allBeams == undefined) {
        return;
      }
      for (const edge of this.allBeams.edges) {
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
