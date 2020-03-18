<template>
  <div class="beamitem">
    <v-container fluid>
      <v-row class="display-1 mx-1 mt-3 primary--text" style="max-width: 980px;">
        <v-col col="8" class="pa-0 ma-0">
          <span class="me-2">
            <v-icon>mdi-spotlight-beam</v-icon>
          </span>Beams
          <v-icon large color="primary">mdi-chevron-right</v-icon>
          {{ $route.params.name }}
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
                <v-btn text icon exact to="/beams" v-on="on">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
              </template>
              <span>Back to Beams</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="800">
              <template v-slot:activator="{ on }">
                <v-btn icon @click="$apollo.queries.beam.refetch();" v-on="on">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>Refresh</span>
            </v-tooltip>
            <v-spacer></v-spacer>
          </v-row>
        </v-container>
        <div v-if="state == State.LOADED">
          <BeamItemCard :beamId="beam.beamId" :collapsible="false" v-on:deleted="$router.push('/beams')"></BeamItemCard>
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
import gql from "graphql-tag";
import BEAM_FRAGMENT from "@/graphql/BeamFragment.gql";

import BeamItemCard from "@/components/BeamItemCard";

const State = {
  LOADED: 0,
  EMPTY: 1,
  LOADING: 2,
  ERROR: 3,
  NONE: 4
};

const GqlBeamName = gql`
  query BeamIdName($name: String) {
    beam(name: $name) {
      ...beam
    }
  }
  ${BEAM_FRAGMENT}
`;

export default {
  name: "BeamItem",
  components: {
    BeamItemCard
  },
  data() {
    return {
      beam: null,
      error: null,
      devtoolState: "off",
      State: State
    };
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
      } else if (this.beam) {
        return State.LOADED;
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.$apollo.queries.beam.loading;
    }
  },
apollo: {
    beam: {
      query: GqlBeamName,
      variables() {
        return {
          name: this.$route.params.name
        };
      },
      result(result) {
        this.error = null;
        if (result.error) {
          this.error = true;
        }
      }
    }
  }
};
</script>
