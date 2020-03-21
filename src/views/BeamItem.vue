<template>
  <div class="beam-item" style="position: relative;">
    <DevToolLoadingStateOverridingMenu @state="devtoolState = $event"></DevToolLoadingStateOverridingMenu>
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
        <BeamItemCard
          :beamId="beam.beamId"
          :collapsible="false"
          v-on:deleted="$router.push('/beams')"
        ></BeamItemCard>
      </div>
    </div>
    <div v-else class="mx-2 pt-5">
      <v-card outlined style="max-width: 980px;">
        <v-card-text>Nothing to show here.</v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import BEAM_FRAGMENT from "@/graphql/BeamFragment.gql";

import BeamItemCard from "@/components/BeamItemCard";

import DevToolLoadingStateOverridingMenu from "@/components/DevToolLoadingStateOverridingMenu";

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
    BeamItemCard,
    DevToolLoadingStateOverridingMenu
  },
  data() {
    return {
      beam: null,
      name: null,
      error: null,
      devtoolState: null,
      State: State
    };
  },
  watch: {
    "$route.params.name": {
      handler: function(n, o) {
        if (n) {
          this.name = n;
        }
      },
      immediate: true
    }
  },
  computed: {
    state() {
      if (this.devtoolState) {
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
          name: this.name
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
