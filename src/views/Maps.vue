<template>
  <div class="maps">
    <v-container fluid>
      <v-row class="display-1 mx-1 mt-3 primary--text" style="max-width: 980px;">
        <v-col col="8" class="pa-0 ma-0">
          <span class="me-2">
            <v-icon>map</v-icon>
          </span>Maps
        </v-col>
      </v-row>
      <MapList></MapList>
    </v-container>
  </div>
</template>

<script>
import MapList from "@/views/MapList";

export default {
  name: "Maps",
  components: {
    MapList
  }
};
</script>
