<template>
  <div class="beam-item-card" style="position: relative;">
    <v-card outlined hover style="max-width: 980px;">
      <div v-if="state == State.LOADING" class="mx-4 py-2">
        <v-progress-circular indeterminate :size="18" :width="3" color="grey"></v-progress-circular>
      </div>
      <v-card-text v-else-if="state == State.ERROR">Error: cannot load data</v-card-text>
      <div v-else-if="state == State.LOADED" @click="$emit('expand')" style="cursor: default;">
        <v-container fluid class="pa-0">
          <v-row class="ma-0 px-0">
            <v-col order="1" cols="10" md="3" class="py-0">
              <div class="caption grey--text">Name</div>
              <div class="font-weight-medium primary--text">
                <span @click.stop>
                  <router-link :to="'/beams/item/' + node.name" v-text="node.name"></router-link>
                </span>
              </div>
            </v-col>
            <v-col order="3" cols="12" md="7" class="py-0">
              <div class="caption grey--text">Paths</div>
                <ul v-if="node.beamFilePaths">
                  <li
                    v-for="(edgep, index) in node.beamFilePaths.edges"
                    :key="index"
                    v-text="edgep.node.path"
                  ></li>
                </ul>
            </v-col>
            <v-col order="2" order-md="4" cols="2" align-self="end" class="py-0">
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
                          <v-list-item disabled v-on="{ ...editDialog }">
                            <v-list-item-icon>
                              <v-icon disabled>mdi-pencil</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Edit</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-dialog>
                      <v-dialog v-model="deleteDialog" max-width="600">
                        <template v-slot:activator="{ on: deleteDialog }">
                          <v-list-item disabled v-on="{ ...deleteDialog }">
                            <v-list-item-icon>
                              <v-icon disabled>mdi-delete</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Delete</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-dialog>
                    </v-list>
                  </v-menu>
                </span>
              </v-row>
            </v-col>
          </v-row>
          <v-expand-transition>
            <v-row class="mx-0 mb-3 px-0 collapsible" v-show="!(collapsible && collapsed)">
              <v-col cols="12" md="8" offset-md="3" class="py-0">
                <div class="caption grey--text">Map</div>
                <div v-if="node.map">
                  <router-link :to="'/maps/item/' + node.map.name" v-text="node.map.name"></router-link>
                </div>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-row>
                  <v-col order="2" order-md="0" cols="12" md="3" align-self="end" class="py-0">
                    <span class="grey--text" style="font-size: 65%;">Data ID: {{ dataId }}</span>
                  </v-col>
              <v-col order="1" cols="12" md="8" class="py-0">
                <div class="caption grey--text">Parent Beam</div>
                <div v-if="node.parentBeam">
                  <router-link
                    :to="'/beams/item/' + node.parentBeam.name"
                    v-text="node.parentBeam.name"
                  ></router-link>
                </div>
              </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expand-transition>
        </v-container>
      </div>
      <v-card-text v-else>Nothing to show here.</v-card-text>
    </v-card>
    <DevToolLoadingStateOverridingMenu @state="devtoolState = $event"></DevToolLoadingStateOverridingMenu>
  </div>
</template>

<script>
import { defaultDataIdFromObject } from "apollo-cache-inmemory";

import BEAM from "@/graphql/Beam.gql";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/DevToolLoadingStateOverridingMenu";

export default {
  name: "BeamItemCard",
  components: {
    DevToolLoadingStateOverridingMenu
  },
  props: {
    beamId: { default: null }, // node.beamId not beam.id
    collapsed: { default: false },
    collapsible: { default: false }
  },
  data() {
    return {
      menu: false,
      editDialog: false,
      deleteDialog: false,
      node: null,
      error: null,
      devtoolState: null,
      State: State
    };
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
      } else if (this.node) {
        return State.LOADED;
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.$apollo.queries.node.loading;
    },
    dataId: function() {
      return defaultDataIdFromObject(this.node);
    }
  },
  apollo: {
    node: {
      query: BEAM,
      variables() {
        return {
          beamId: this.beamId
        };
      },
      update: data => data.beam,
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
