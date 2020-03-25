<template>
  <div class="simulations">
    <v-container fluid>
      <v-row class="display-1 mx-1 mt-3 primary--text" style="max-width: 980px;">
        <v-col col="8" class="pa-0 ma-0">
          <span class="me-2">
            <v-icon>mdi-creation</v-icon>
          </span>Simulations
          <span v-if="$route.name == 'SimulationItem'">
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
  name: "Simulations",
  data: () => ({
    transitionName: "fade-simulations-leave",
    transitionMode: "out-in"
  }),
  beforeRouteUpdate(to, from, next) {
    this.transitionName = "fade-simulations-update";
    this.transitionMode = "out-in";
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.transitionName = "fade-simulations-leave";
    this.transitionMode = "out-in";
    next();
  }
};
</script>

<style scoped>
.fade-simulations-update-enter-active {
  transition: opacity 0.2s;
}

.fade-simulations-update-leave-active {
  transition: opacity 0s;
}

.fade-simulations-update-enter,
.fade-simulations-update-leave-to {
  opacity: 0;
}

.fade-simulations-leave-enter-active {
  transition: opacity 0s;
}

.fade-simulations-leave-leave-active {
  transition: opacity 0s;
}

.fade-simulations-leave-enter {
  opacity: 1;
}

.fade-simulations-leave-leave-to {
  opacity: 1;
}
</style>
