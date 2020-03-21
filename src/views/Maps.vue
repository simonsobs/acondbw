<template>
  <div class="maps">
    <v-container fluid>
      <v-row class="display-1 mx-1 mt-3 primary--text" style="max-width: 980px;">
        <v-col col="8" class="pa-0 ma-0">
          <span class="me-2">
            <v-icon>map</v-icon>
          </span>Maps
          <span v-if="$route.name == 'MapItem'">
            <v-icon large color="primary">mdi-chevron-right</v-icon>
            {{ $route.params.name }}
          </span>
        </v-col>
      </v-row>
      <transition :name="transitionName" :mode="transitionMode">
        <keep-alive>
          <router-view :key="$route.name"></router-view>
        </keep-alive>
      </transition>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Maps",
  data: () => ({
    transitionName: null,
    transitionMode: null
  }),
  beforeRouteUpdate(to, from, next) {
    console.log("here")
    this.transitionName = "fade-maps-slow";
    this.transitionMode = "out-in";
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log("there")
    this.transitionName = "fade-maps-fast";
    this.transitionMode = "out-in";
    next();
  }
};
</script>

<style scoped>
.fade-maps-slow-enter-active {
  transition: opacity 0.2s;
}

.fade-maps-slow-leave-active {
  transition: opacity 0.1s;
}

.fade-maps-slow-enter,
.fade-maps-slow-leave-to {
  opacity: 0;
}

.fade-maps-fast-enter-active {
  transition: opacity 0.02s;
}

.fade-maps-fast-leave-active {
  transition: opacity 0.01s;
}

.fade-maps-fast-enter,
.fade-maps-fast-leave-to {
  opacity: 0;
}
</style>
