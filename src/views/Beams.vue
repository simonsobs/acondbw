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
          <router-view :key="$route.name"></router-view>
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
    this.transitionName = "fade-beams-slow";
    this.transitionMode = "out-in";
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.transitionName = "fade-beams-fast";
    this.transitionMode = "out-in";
    next();
  }
};
</script>
  
  <style scoped>
  .fade-beams-slow-enter-active {
    transition: opacity 0.4s;
  }

  .fade-beams-slow-leave-active {
    transition: opacity 0.01s;
  }

  .fade-beams-slow-enter,
  .fade-beams-slow-leave-to {
    opacity: 0;
  }

  .fade-beams-fast-enter-active {
    transition: opacity 0.02s;
  }

  .fade-beams-fast-leave-active {
    transition: opacity 0.01s;
  }

  .fade-beams-fast-enter,
  .fade-beams-fast-leave-to {
  opacity: 0;
}
</style>
