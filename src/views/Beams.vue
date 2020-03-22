<template>
  <div class="beams">
    <v-container fluid>
      <v-row class="display-1 mx-1 mt-3 primary--text" style="max-width: 980px;">
        <v-col col="8" class="pa-0 ma-0">
          <span class="me-2">
            <v-icon>mdi-spotlight-beam</v-icon>
          </span>Beams
          <span v-if="$route.name == 'BeamItem'">
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
  name: "Beams",
  data: () => ({
    transitionName: null,
    transitionMode: null
  }),
  beforeRouteUpdate(to, from, next) {
    this.transitionName = "fade-beams-update";
    this.transitionMode = "out-in";
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.transitionName = "fade-beams-leave";
    this.transitionMode = "out-in";
    next();
  }
};
</script>
  
  <style scoped>
.fade-beams-update-enter-active {
  transition: opacity 0.2s;
}

.fade-beams-update-leave-active {
  transition: opacity 0s;
}

.fade-beams-update-enter,
.fade-beams-update-leave-to {
  opacity: 0;
}

.fade-beams-leave-enter-active {
  transition: opacity 0s;
}

.fade-beams-leave-leave-active {
  transition: opacity 01;
}

.fade-beams-leave-enter {
  opacity: 1;
}

.fade-beams-leave-leave-to {
  opacity: 1;
}
</style>
