<template>
  <div class="mapitemcard">
    <div v-if="$apollo.queries.map.loading">loading...</div>
    <div v-else-if="error">Error: cannot load data</div>
    <v-card v-else-if="map" outlined hover style="max-width: 980px;">
      <div @click="$emit('expand')" style="cursor: default;">
        <v-container fluid class="pa-0">
          <v-row class="ma-0 px-0">
            <v-col cols="12" md="4" class="py-0">
              <div class="caption grey--text">Name</div>
              <div class="font-weight-medium primary--text">
                <span @click.stop>
                  <router-link :to="'/maps/item/' + map.name" v-text="map.name"></router-link>
                </span>
              </div>
            </v-col>
            <v-col cols="6" md="4" class="py-0">
              <div class="caption grey--text">Date posted</div>
              <div v-text="map.datePosted"></div>
            </v-col>
            <v-col cols="5" md="3" class="py-0">
              <div class="caption grey--text">Mapper</div>
              <div v-text="map.mapper"></div>
            </v-col>
            <v-col cols="1" md="1" align-self="end" class="py-0">
              <v-row align="start" justify="end" class="px-1 py-0">
                <div v-if="collapsible">
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
                </div>
                <span @click.stop>
                  <v-menu left bottom offset-y v-model="menu" :close-on-content-click="false">
                    <template v-slot:activator="{ on: menu }">
                      <v-btn icon v-on="{ ...menu }">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-dialog v-model="editDialog" persistent max-width="600">
                        <template v-slot:activator="{ on: editDialog }">
                          <v-list-item v-on="{ ...editDialog }">
                            <v-list-item-icon>
                              <v-icon>mdi-pencil</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Edit</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                        <MapEditForm
                          :mapId="map.mapId"
                          v-on:finished="editDialog = false; menu = false"
                        ></MapEditForm>
                      </v-dialog>
                      <v-dialog v-model="deleteDialog" persistent max-width="600">
                        <template v-slot:activator="{ on: deleteDialog }">
                          <v-list-item v-on="{ ...deleteDialog }">
                            <v-list-item-icon>
                              <v-icon>mdi-delete</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Delete</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                        <MapDeleteForm
                          :mapId="map.mapId"
                          v-on:finished="deleteDialog = false; menu = false"
                          v-on:deleted="deleteDialog = false; menu = false; map = null"
                        ></MapDeleteForm>
                      </v-dialog>
                    </v-list>
                  </v-menu>
                </span>
              </v-row>
            </v-col>
          </v-row>
          <v-expand-transition>
            <v-row class="mx-0 mb-3 px-0 collapsible" v-show="!(collapsible && collapsed)">
              <v-col cols="12" md="8" offset-md="4" class="py-0">
                <div class="caption grey--text">Paths</div>
                <ul v-if="map.mapFilePaths">
                  <li
                    v-for="(edgep, index) in map.mapFilePaths.edges"
                    :key="index"
                    v-text="edgep.node.path"
                  ></li>
                </ul>
              </v-col>
              <v-col cols="12" md="8" offset-md="4" class="py-0">
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
              <v-col cols="12" class="py-0">
                <v-row>
                  <v-col cols="12" md="4" align-self="end" class="py-0">
                    <span class="grey--text" style="font-size: 65%;">Data ID: {{ dataId }}</span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0">
                    <div class="caption grey--text">Beams</div>
                    <ul v-if="map.beams">
                      <li v-for="(edgep, index) in map.beams.edges" :key="index">
                        <router-link
                          :to="'/beams/item/' + edgep.node.name"
                          v-text="edgep.node.name"
                        ></router-link>
                      </li>
                    </ul>
                  </v-col>
                </v-row>
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
import { defaultDataIdFromObject } from "apollo-cache-inmemory";

import gql from "graphql-tag";
import MAP from "@/graphql/Map.gql";
import ALL_MAPS from "@/graphql/AllMaps.gql";

import MapEditForm from "@/components/MapEditForm";
import MapDeleteForm from "@/components/MapDeleteForm";

export default {
  name: "MapItemCard",
  components: {
    MapEditForm,
    MapDeleteForm
  },
  props: {
    mapId: { default: null }, // map.mapId not map.id
    collapsed: { default: false },
    collapsible: { default: false }
  },
  data() {
    return {
      menu: false,
      editDialog: false,
      deleteDialog: false,
      map: null,
      error: null
    };
  },
  computed: {
    dataId: function() {
      return defaultDataIdFromObject(this.map);
    }
  },

  apollo: {
    map: {
      query: MAP,
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
      this.$emit("deleted");
    }
  }
};
</script>
