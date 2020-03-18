<template>
  <div class="maps">
    <v-container fluid>
      <v-row class="display-1 mx-1 mt-3 primary--text" style="max-width: 980px;">
        <v-col col="8" class="pa-0 ma-0">
          <span class="me-2">
            <v-icon>map</v-icon>
          </span>Maps
        </v-col>
        <v-col col="4" class="pa-0 ma-0">
          <v-row align="start" justify="end" class="px-1 py-0">
            <v-menu right bottom offset-x :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon x-small color="grey lighten-1">mdi-nut</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-subheader>Dev tools</v-subheader>
                <v-list-item-group v-model="devtoolState">
                  <v-list-item :value="State.LOADING">
                    <v-list-item-title>loading</v-list-item-title>
                  </v-list-item>
                  <v-list-item :value="State.ERROR">
                    <v-list-item-title>error</v-list-item-title>
                  </v-list-item>
                  <v-list-item :value="State.EMPTY">
                    <v-list-item-title>empty</v-list-item-title>
                  </v-list-item>
                  <v-list-item :value="State.NONE">
                    <v-list-item-title>none</v-list-item-title>
                  </v-list-item>
                  <v-list-item value="off">
                    <v-list-item-title>off</v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </v-row>
        </v-col>
      </v-row>
      <div v-if="state == State.LOADING" class="mx-2 pt-5">
        <v-progress-circular indeterminate :size="26" color="grey"></v-progress-circular>
      </div>
      <div v-else-if="state == State.ERROR" class="mx-2 pt-5">
        <v-card outlined style="max-width: 980px;">
          <v-card-text>Error: cannot load data</v-card-text>
        </v-card>
      </div>
      <div v-else-if="state == State.LOADED || state == State.EMPTY">
        <v-container fluid class="pa-0">
          <v-row align="start" justify="end" class="ma-0 px-0 pt-3 pb-1" style="max-width: 980px;">
            <v-tooltip bottom open-delay="800">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  @click="$apollo.queries.allMaps.refetch(); areAllCardsCollapsed = true"
                  v-on="on"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>Refresh</span>
            </v-tooltip>
            <v-spacer></v-spacer>
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
            <v-dialog v-model="dialog" persistent max-width="600">
              <template v-slot:activator="{ on: dialog }">
                <v-tooltip bottom open-delay="800">
                  <template v-slot:activator="{ on: toolip }">
                    <v-btn icon v-on="{ ...toolip, ...dialog }">
                      <v-icon>mdi-plus-thick</v-icon>
                    </v-btn>
                  </template>
                  <span>Add a new map</span>
                </v-tooltip>
              </template>
              <MapAddForm v-on:finished="dialog = false"></MapAddForm>
            </v-dialog>
          </v-row>
        </v-container>
        <div v-if="state == State.LOADED">
          <MapItemCard
            v-for="edge in allMaps.edges"
            :key="edge.node.id"
            :mapId="edge.node.mapId"
            collapsible="true"
            :collapsed="isCardCollapsed[edge.node.id]"
            v-on:expand="isCardCollapsed[edge.node.id] = false"
            v-on:collapse="isCardCollapsed[edge.node.id] = true"
            class="my-1"
          ></MapItemCard>
        </div>
        <div v-else>
          <v-card outlined style="max-width: 980px;">
            <v-card-text>Empty. No maps are found.</v-card-text>
          </v-card>
        </div>
      </div>
      <div v-else class="mx-2 pt-5">
        <v-card outlined style="max-width: 980px;">
          <v-card-text>Nothing to show here.</v-card-text>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import ALL_MAPS from "@/graphql/AllMaps.gql";

import MapItemCard from "@/components/MapItemCard";
import MapAddForm from "@/components/MapAddForm";

const State = {
  LOADED: 0,
  EMPTY: 1,
  LOADING: 2,
  ERROR: 3,
  NONE: 4
};

export default {
  name: "maps",
  components: {
    MapItemCard,
    MapAddForm
  },
  data() {
    return {
      dialog: false,
      allMaps: null,
      isCardCollapsed: {},
      error: null,
      devtoolState: "off",
      State: State
    };
  },
  apollo: {
    allMaps: {
      query: ALL_MAPS,
      result(result) {
        this.error = null;
        if (result.error) {
          this.error = true;
        }
      }
    }
  },
  computed: {
    state() {
      if (this.devtoolState != "off") {
        return this.devtoolState;
      }

      if (this.loading) {
        return State.LOADING;
      } else if (this.error) {
        return State.ERROR;
      } else if (this.allMaps) {
        if (this.allMaps.edges && this.allMaps.edges.length) {
          return State.LOADED;
        } else {
          return State.EMPTY;
        }
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.$apollo.queries.allMaps.loading;
    },
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
  }
};
</script>
