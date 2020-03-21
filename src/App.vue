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
          <router-view :key="routeKey"></router-view>
        </keep-alive>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
const ROUTE_KEY_MAP = {
  // This map is used to generate the key for <router-view>
  // e.g., $route.name => key for <router-view>
  
  // $route.name will be used as the key if not in this map
  
  // When routes (defined in src/routes/index.js) are nested
  // the nested routes shuld have the same key.
  
  // This is for <transition> and <keep-alive>, the two tags
  // enclosing <router-view> in the template.
  
  // The transition effect is not applied when the key is the
  // same. The transition effect can be applied in the nested
  // component. (This doesn't seem to be always the case. So
  // now watching $route and dynamically updating the attributes
  // of <transition>)
  
  // With <keep-alive>, the cached parent object will be reused
  // with the old child object, which can be a wrong object.
  // To prevent this, give different keys to different child
  // objects in <router-view> in the parent object.
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
      { name: "Maps", path: "/maps", icon: "mdi-map" },
      { name: "Beams", path: "/beams", icon: "mdi-spotlight-beam" }
    ],
    drawer: null,
    transitionName: null,
    transitionMode: null
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
        this.transitionName = null;
        this.transitionMode = null;
      } else {
        this.transitionName = "fade-app";
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
.fade-app-enter-active {
  transition: opacity 0.4s;
}
.fade-app-enter {
  opacity: 0;
}
.fade-app-leave-active {
  transition: opacity 0.01s;
}
.fade-app-leave-to {
  opacity: 0;
}
</style>
<!-- the leave active is set very short because sometimes
the animation starts with wrong components of nested routes.
If the duration is long, the wrong components will slowly 
fade away. In addition, the leave active needs to be shorter
than that in the nested route component. Otherwise, the 
component leave twice. 
-->
