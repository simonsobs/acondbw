<template>
  <div class="mapitemcard">
    <div v-if="$apollo.queries.map.loading">loading...</div>
    <div v-else-if="error">Error: cannot load data</div>
    <v-card v-else-if="map" outlined hover style="max-width: 980px;">
      <div @click="$emit('expand')" style="cursor: default;">
        <v-container fluid class="pa-0">
          <v-row class="ma-0 px-0">
            <v-col cols="12" md="4" class="pa-2">
              <div class="caption grey--text">Name</div>
              <div class="font-weight-medium primary--text">
                <span @click.stop>
                  <router-link :to="'/maps/item/' + map.name" v-text="map.name"></router-link>
                </span>
              </div>
            </v-col>
            <v-col cols="6" md="4" class="pa-2">
              <div class="caption grey--text">Date posted</div>
              <div v-text="map.datePosted"></div>
            </v-col>
            <v-col cols="5" md="3" class="pa-2">
              <div class="caption grey--text">Mapper</div>
              <div v-text="map.mapper"></div>
            </v-col>
            <v-col cols="1" md="1" align-self="end" class="pa-2">
              <div v-if="collapsible">
                <v-row align="start" justify="end" class="px-1">
                  <v-tooltip bottom open-delay="800">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        @click.stop="
                      collapsed ? $emit('expand') : $emit('collapse')
                    "
                        v-on="on"
                      >
                        <v-icon>
                          {{
                          collapsed ? "mdi-chevron-down" : "mdi-chevron-up"
                          }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>{{ collapsed ? "Expand" : "Collapse" }}</span>
                  </v-tooltip>
                </v-row>
              </div>
            </v-col>
          </v-row>
          <v-expand-transition>
            <v-row class="mx-0 mb-3 px-0 collapsible" v-show="!(collapsible && collapsed)">
              <v-col cols="12" md="8" offset-md="4" class="pa-2">
                <div class="caption grey--text">Paths</div>
                <ul v-if="map.mapFilePaths">
                  <li
                    v-for="(edgep, index) in map.mapFilePaths.edges"
                    :key="index"
                    v-text="edgep.node.path"
                  ></li>
                </ul>
              </v-col>
              <v-col cols="12" md="8" offset-md="4" class="pa-2">
                <div class="caption grey--text">Note</div>
                <div>
                  <ul v-if="map.note">
                    <li
                      v-for="(line, index) in map.note.split('\n')"
                      :key="index"
                    >{{ line.replace(/^- */, "") }}</li>
                  </ul>
                </div>
              </v-col>
              <v-col cols="12" md="8" offset-md="4" class="pa-2">
                <div class="caption grey--text">Beams</div>
                <ul v-if="map.beams">
                  <li v-for="(edgep, index) in map.beams.edges" :key="index">
                    <router-link :to="'/beams/item/' + edgep.node.name" v-text="edgep.node.name"></router-link>
                  </li>
                </ul>
              </v-col>
            </v-row>
          </v-expand-transition>
        </v-container>
      </div>
    </v-card>
    <div v-else>Nothing to show here.</div>
  </div>
</template>

<script>
import MAP from "@/graphql/Map.gql";

export default {
  name: "MapItemCard",
  props: {
    mapName: { default: null },
    collapsed: { default: false },
    collapsible: { default: false }
  },
  data() {
    return {
      map: null,
      error: null
    };
  },
  apollo: {
    map: {
      query: MAP,
      variables() {
        return {
          name: this.mapName
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
