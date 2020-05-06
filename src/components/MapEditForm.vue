<template>
  <div class="mapeditform">
    <div v-if="$apollo.queries.map.loading">loading...</div>
    <div v-else-if="error">Error: cannot load data</div>
    <v-card v-else-if="form">
      <v-card-title class="headline">Edit a map</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="Name of map" v-model="form.name" required prepend-icon="map"></v-text-field>
          <v-menu
            v-model="menuDatePosteDatePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="form.datePosted"
                label="Date posted"
                prepend-icon="event"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="form.datePosted"
              no-title
              scrollable
              @input="menuDatePosteDatePicker = false"
            ></v-date-picker>
          </v-menu>
          <v-text-field label="producedBy" v-model="form.producedBy" prepend-icon="person"></v-text-field>
          <!-- 
            <v-textarea
              label="Paths"
              v-model="form.paths"
              hint="A path per line. e.g., nersc:/go/to/my/maps_v3"
              prepend-icon="mdi-folder-multiple"
            ></v-textarea>
          -->
          <v-textarea
            label="Note"
            v-model="form.note"
            hint="Itemized text. One iterm per line"
            prepend-icon="mdi-file-document-box-outline"
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="$emit('finished')">Cancel</v-btn>
        <v-btn color="primary" @click="editMap()">Save</v-btn>
      </v-card-actions>
    </v-card>
    <div v-else>Nothing to show here.</div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import MAP from "@/graphql/Map.gql";
import ALL_MAPS from "@/graphql/AllMaps.gql";
import MAP_FRAGMENT from "@/graphql/MapFragment.gql";

const MAP_FOR_EDIT = gql`
  query MapForEdit($mapId: Int!) {
    map(mapId: $mapId) {
      id
      mapId
      name
      datePosted
      producedBy
      note
    }
  }
`;

export default {
  name: "MapEditForm",
  props: {
    mapId: { default: null } // map.mapId not map.id
  },
  data() {
    return {
      map: null,
      error: null,
      menuDatePosteDatePicker: false,
      form: null
    };
  },
  apollo: {
    map: {
      query: MAP_FOR_EDIT,
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
  watch: {
    map() {
      this.form = (({ name, datePosted, producedBy, note }) => ({
        name,
        datePosted,
        producedBy,
        note
      }))(this.map);
    }
  },
  methods: {
    clearForm() {
      this.form = null;
    },
    async editMap() {
      // this.$emit("finished");
      try {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation($mapId: Int!, $input: UpdateMapInput!) {
              updateMap(mapId: $mapId, input: $input) {
                ok
                map {
                  ...map
                }
              }
            }
            ${MAP_FRAGMENT}
          `,
          variables: { mapId: this.map.mapId, input: this.form }
        });
        // this.$emit("finished");
        this.clearForm();
      } catch (error) {
        console.log(error);
      }
      this.$emit("finished");
    }
  }
};
</script>
