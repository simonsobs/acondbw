<template>
  <v-card outlined hover>
    <div @click="$emit('expand')" style="cursor: default;">
      <v-layout row wrap class="ma-0 px-3">
        <v-flex xs12 md4>
          <div class="caption grey--text">Name</div>
          <div class="font-weight-medium primary--text">
            <span @click.stop>
              <router-link :to="'/maps/item/' + map.name" v-text="map.name"></router-link>
            </span>
          </div>
        </v-flex>
        <v-flex xs6 md4>
          <div class="caption grey--text">Date posted</div>
          <div v-text="map.datePosted"></div>
        </v-flex>
        <v-flex xs5 md3>
          <div class="caption grey--text">Mapper</div>
          <div v-text="map.mapper"></div>
        </v-flex>
        <v-flex xs1 md1 align-self-end>
          <div v-if="collapsible">
            <v-layout justify-end>
              <v-tooltip bottom open-delay="800">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    @click.stop="collapsed ? $emit('expand') : $emit('collapse')"
                    v-on="on"
                  >
                    <v-icon>{{ collapsed ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ collapsed ? 'Expand' : 'Collapse' }}</span>
              </v-tooltip>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
      <v-expand-transition>
        <v-layout row wrap class="mx-0 mb-3 px-3" v-show="!(collapsible && collapsed)">
          <v-flex xs12 md8 offset-md-4>
            <div class="caption grey--text">Paths</div>
            <ul>
              <li
                v-for="(edgep, index) in map.mapFilePaths.edges"
                :key="index"
                v-text="edgep.node.path"
              ></li>
            </ul>
          </v-flex>
          <v-flex xs12 md8 offset-md-4>
            <div class="caption grey--text">Note</div>
            <div>
              <ul>
                <li
                  v-for="(line, index) in map.note.split('\n')"
                  :key="index"
                >{{ line.replace(/^- */, "") }}</li>
              </ul>
            </div>
          </v-flex>
          <v-flex xs12 md8 offset-md-4>
            <div class="caption grey--text">Beams</div>
            <ul>
              <li v-for="(edgep, index) in map.beams.edges" :key="index">
                <router-link :to="'/beams/item/' + edgep.node.name" v-text="edgep.node.name"></router-link>
              </li>
            </ul>
          </v-flex>
        </v-layout>
      </v-expand-transition>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "mapItemCard",
  props: {
    map: { default: {} },
    collapsed: { default: false },
    collapsible: { default: false }
  }
};
</script>
