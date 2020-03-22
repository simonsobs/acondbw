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
          <router-view :key="$route.fullPath"></router-view>
        </keep-alive>
      </transition>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Maps",
  data: () => ({
    transitionName: "fade-maps-leave",
    transitionMode: "out-in"
  }),
  beforeRouteUpdate(to, from, next) {
    console.log(from.path);
    console.log(from.to);
    this.transitionName = "fade-maps-update";
    this.transitionMode = "out-in";
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.transitionName = "fade-maps-leave";
    this.transitionMode = "out-in";
    next();
  }
};
</script>

<style scoped>
.fade-maps-update-enter-active {
  transition: opacity 0.2s;
}

.fade-maps-update-leave-active {
  transition: opacity 0s;
}

.fade-maps-update-enter,
.fade-maps-update-leave-to {
  opacity: 0;
}

.fade-maps-leave-enter-active {
  transition: opacity 0s;
}

.fade-maps-leave-leave-active {
  transition: opacity 0s;
}

.fade-maps-leave-enter {
  opacity: 1;
}

.fade-maps-leave-leave-to {
  opacity: 1;
}
</style>
