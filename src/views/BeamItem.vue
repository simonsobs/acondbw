<template>
  <div class="beamitem">
    <v-container>
      <h2>Beam</h2>
      <div class="d-flex justify-start my-2">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ on }">
            <v-btn text icon exact to="/maps" v-on="on">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>Back to Beams</span>
        </v-tooltip>
      </div>
      <BeamItemCard
        :beam="item"
        :collapsible="false"
      ></BeamItemCard>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

import BeamItemCard from "@/components/BeamItemCard";

export default {
  name: "beamItem",
  components: {
    BeamItemCard
  },
  data() {
    return {
      item: {}
    };
  },
  created: function() {
    this.loadData();
  },
  methods: {
    loadData() {
      const url = process.env.VUE_APP_ACONDBS_URL;
      const query = `
        query Beam($name: String) {
          beam(name: $name) {
            beamId
            name
            path
            map {
              name
            }
            parentBeam {
              name
            }
          }
        }
      `;
      const variables = { name: this.$route.params.name }
      axios({
        url: url,
        method: "POST",
        data: {
          query: query,
          variables: variables
        }
      }).then(response => {
        this.item = response.data.data.beam;
      });
    }
  }
};
</script>
