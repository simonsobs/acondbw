<template>
  <div class="maps">
    <v-container>
      <h2>Maps</h2>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="100"
        hide-default-footer
        dense
      ></v-data-table>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "maps",
  data: function() {
    return {
      headers: [],
      items: []
    };
  },
  created: function() {
    const path = "http://localhost:5000/maps";
    axios.get(path).then(response => {
      this.headers = response.data.schema.fields.map(f => ({
        text: f.name,
        value: f.name
      }));
      this.items = response.data.data;
    });
  }
};
</script>
