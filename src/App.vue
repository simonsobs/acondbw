<template>
  <v-app>
    <router-view name="frame"></router-view>
    <v-main>
      <transition :name="transitionName" :mode="transitionMode">
        <keep-alive>
          <router-view :key="$route.fullPath"></router-view>
        </keep-alive>
      </transition>
    </v-main>
    <snackbar></snackbar>
  </v-app>
</template>

<script>
import Snackbar from "@/components/layout/Snackbar.vue";

export default {
  name: "App",
  components: {
    Snackbar,
  },
  metaInfo() {
    return {
      title: this.title || "loading...",
      titleTemplate: null,
    };
  },
  data: () => ({
    transitionName: "fade-app-across",
    transitionMode: "out-in",
    // title: null,
    error: null,
  }),
  computed: {
    title() {
      return this.$store.state.webConfig.headTitle || "";
    }
  },
  watch: {
    $route(to, from) {
      // update the transition effect dynamically
      // https://router.vuejs.org/guide/advanced/transitions.html#per-route-transition

      const toTopDir = to.path.split("/")[1]; // e.g., "/abc/def/ghi/" -> "abc"
      const fromTopDir = from.path.split("/")[1];

      if (toTopDir == fromTopDir) {
        this.transitionName = "fade-app-within";
        this.transitionMode = "out-in";
      } else {
        this.transitionName = "fade-app-across";
        this.transitionMode = "out-in";
      }
    },
  },
};
</script>

<!-- https://github.com/sindresorhus/github-markdown-css -->
<style scoped>
@import "../node_modules/github-markdown-css/github-markdown-light.css";

.fade-app-across-enter-active {
  transition: opacity 0.8s;
}

.fade-app-across-leave-active {
  transition: opacity 0s;
}

.fade-app-across-enter,
.fade-app-across-leave-to {
  opacity: 0;
}

.fade-app-within-enter-active,
.fade-app-within-leave-active {
  transition: opacity 0s;
}

.fade-app-within-enter,
.fade-app-within-leave-to {
  opacity: 1;
}
</style>
<!-- The leave active for ".fade-app-across" is set to zero because
sometimes the fade away starts from a wrong image.

For .fade-app-within, the oparicty is set to one and the duration is
set to zero for both enter and leave, which is effectivly diabling the
transition effects, letting the nested routes handle the transition
effects. -->
