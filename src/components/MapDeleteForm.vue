<template>
  <div class="mapdeleteform">
    <v-card v-if="loading">
      <v-card-text>loading...</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else-if="error">
      <v-card-text>Error: cannot load data</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else-if="map">
      <v-card-title class="headline">Delete a map</v-card-title>
      <v-card-text
        class="body-1 font-weight-medium error--text"
      >Really, delete the map "{{ map.name }}"?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
        <v-btn color="error" @click="deleteMap()">Delete</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-text>Nothing to show here.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import gql from "graphql-tag";
import MAP from "@/graphql/Map.gql";
import ALL_MAPS from "@/graphql/AllMaps.gql";

const MAP_FOR_DELETE = gql`
  query MapForDelete($mapId: Int!) {
    map(mapId: $mapId) {
      id
      mapId
      name
    }
  }
`;

export default {
  name: "MapDeleteForm",
  props: {
    mapId: { default: null } // map.mapId not map.id
  },
  data() {
    return {
      map: null,
      error: null
    };
  },
  computed: {
    loading() {
      return this.$apollo.queries.map.loading;
    }
  },
  apollo: {
    map: {
      query: MAP_FOR_DELETE,
      variables() {
        return {
          mapId: this.mapId
        };
      },
      result(result) {
        this.error = null;
        if (result.error) {
          this.error = true;
        }
      }
    }
  },
  methods: {
    async deleteMap() {
      const data = await this.$apollo.mutate({
        mutation: gql`
          mutation($mapId: Int!) {
            deleteMap(mapId: $mapId) {
              ok
            }
          }
        `,
        variables: {
          mapId: this.map.mapId
        },
        update: (cache, { data: { deleteMap } }) => {
          const data = cache.readQuery({
            query: ALL_MAPS
          });
          const index = data.allMaps.edges.findIndex(
            e => e.node.mapId == this.map.mapId
          );
          data.allMaps.edges.splice(index, 1);
          cache.writeQuery({
            query: ALL_MAPS,
            data
          });
        }
      });
      this.$emit("finished");
      this.$emit("deleted");
    }
  }
};
</script>
