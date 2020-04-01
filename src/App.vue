<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list shaped>
        <v-list-item link router v-for="page in pages" :key="page.name" :to="page.path">
          <v-list-item-action>
            <v-icon v-text="page.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="page.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dense clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>
        <router-link to="/" v-text="title" style="text-decoration: none; color: inherit;"></router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/about">
        <v-icon>mdi-information</v-icon>
      </v-btn>

      <v-menu left bottom offset-y open-on-hover :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="$vuetify.theme.dark = !$vuetify.theme.dark">
            <v-list-item-icon>
              <v-icon>mdi-invert-colors</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Toggle dark mode</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :href="graphiqlUrl" target="_blank">
            <v-list-item-icon>
              <v-icon>mdi-graphql</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>GraphiQL</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <transition :name="transitionName" :mode="transitionMode">
        <keep-alive>
          <router-view :key="$route.fullPath"></router-view>
        </keep-alive>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
const ROUTE_KEY_MAP = {
  // This map was originally introduced to generate the key for
  // <router-view> (It is no longer used in this way.)

  // This map is currently used for <transition>, enclosing
  // <router-view>.

  // In this app, nested routes are used
  // (https://router.vuejs.org/guide/essentials/nested-routes.html).
  // The nested <router-view> can be also enclosed by <transition>.

  // This map relates $route.name of the nested paths of the same
  // parent to the same value so that different transition effects can
  // be applied for routing between the nested paths of the same
  // parent.
  SimulationList: "Simulations",
  SimulationItem: "Simulations",
  MapList: "Maps",
  MapItem: "Maps",
  BeamList: "Beams",
  BeamItem: "Beams"
};

export default {
  name: "App",
  data: () => ({
    title: process.env.VUE_APP_TOOLBAR_TITLE,
    graphiqlUrl: process.env.VUE_APP_GRAPHQL_HTTP,
    pages: [
      { name: "Simulations", path: "/simulations", icon: "mdi-creation" },
      { name: "Maps", path: "/maps", icon: "mdi-map" },
      { name: "Beams", path: "/beams", icon: "mdi-spotlight-beam" }
    ],
    drawer: null,
    transitionName: "fade-app-across",
    transitionMode: "out-in"
  }),
  created() {
    this.$vuetify.theme.dark = false;
  },
  watch: {
    $route(to, from) {
      // update the transition effect dynamically
      // https://router.vuejs.org/guide/advanced/transitions.html#per-route-transition

      const toKey = this.createRouteKey(to.name);
      const fromKey = this.createRouteKey(from.name);
      if (toKey == fromKey) {
        this.transitionName = "fade-app-within";
        this.transitionMode = "out-in";
      } else {
        this.transitionName = "fade-app-across";
        this.transitionMode = "out-in";
      }
    }
  },
  computed: {
    routeKey() {
      return this.createRouteKey(this.$route.name);
    }
  },
  methods: {
    createRouteKey(name) {
      if (name in ROUTE_KEY_MAP) {
        return ROUTE_KEY_MAP[name];
      } else {
        return name;
      }
    }
  }
};
</script>

<style scoped>
.fade-app-across-enter-active {
  transition: opacity 0.2s;
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
