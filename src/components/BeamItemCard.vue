<template>
  <v-card outlined hover>
    <div @click="$emit('expand')" style="cursor: default;">
      <v-layout row wrap class="ma-0 px-3">
        <v-flex xs12 md3>
          <div class="caption grey--text">Name</div>
          <div class="font-weight-medium primary--text">
            <span @click.stop>
              <router-link
                :to="'/beams/item/' + beam.name"
                v-text="beam.name"
              ></router-link>
            </span>
          </div>
        </v-flex>
        <v-flex xs11 md8>
          <div class="caption grey--text">Path</div>
          <div v-text="beam.path"></div>
        </v-flex>
        <v-flex xs1 md1 align-self-end>
          <div v-if="collapsible">
            <v-layout justify-end>
              <v-tooltip bottom open-delay="800">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    @click.stop="
                      collapsed ? $emit('expand') : $emit('collapse')
                    "
                    v-on="on"
                  >
                    <v-icon>{{
                      collapsed ? "mdi-chevron-down" : "mdi-chevron-up"
                    }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ collapsed ? "Expand" : "Collapse" }}</span>
              </v-tooltip>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
      <v-expand-transition>
        <v-layout
          row
          wrap
          class="mx-0 mb-3 px-3"
          v-show="!(collapsible && collapsed)"
        >
          <v-flex xs12 md8 offset-md-3>
            <div class="caption grey--text">Map</div>
            <div v-if="beam.map">
              <router-link
                :to="'/maps/item/' + beam.map.name"
                v-text="beam.map.name"
              ></router-link>
            </div>
          </v-flex>
          <v-flex xs12 md4 offset-md-3>
            <div class="caption grey--text">Parent Beam</div>
            <div v-if="beam.parentBeam"></div>
            <div v-if="beam.parentBeam">
              <router-link
                :to="'/beams/item/' + beam.parentBeam.name"
                v-text="beam.parentBeam.name"
              ></router-link>
            </div>
          </v-flex>
        </v-layout>
      </v-expand-transition>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "beamItemCard",
  props: {
    beam: { default: {} },
    collapsed: { default: false },
    collapsible: { default: false }
  }
};
</script>
