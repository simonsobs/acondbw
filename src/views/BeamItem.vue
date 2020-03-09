<template>
  <div class="beamitem">
    <v-container fluid>
      <h2>Beam</h2>
      <div class="d-flex justify-start my-2" style="max-width: 980px;">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ on }">
            <v-btn text icon exact to="/beams" v-on="on">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>Back to Beams</span>
        </v-tooltip>
      </div>
      <div v-if="$apollo.queries.beam.loading">loading...</div>
      <div v-else-if="error">Error: cannot load data</div>
      <div v-else-if="beam">
        <BeamItemCard :beamName="beam.name" :collapsible="false"></BeamItemCard>
      </div>
      <div v-else>Nothing to show here.</div>
    </v-container>
  </div>
</template>

<script>
import gql from "graphql-tag";

import BeamItemCard from "@/components/BeamItemCard";

const GqlBeamName = gql`
  query BeamIdName($name: String) {
    beam(name: $name) {
      beamId
      name
    }
  }
`;

export default {
  name: "BeamItem",
  components: {
    BeamItemCard
  },
  data() {
    return {
      beam: null,
      error: null
    };
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
