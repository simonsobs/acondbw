import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import ProductTop from "@/views/ProductTop.vue";

import ALL_MAPS from "@/graphql/AllMaps.gql";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/About.vue"),
  },
  {
    path: "/simulations",
    component: ProductTop,
    props: {
      title: "Simulations",
      icon: "mdi-creation",
      itemPageName: "SimulationItem",
    },
    children: [
      {
        path: "",
        name: "SimulationList",
        component: () =>
          import(
            /* webpackChunkName: "simulations" */ "@/views/SimulationList.vue"
          ),
      },
      {
        path: "item/:name",
        name: "SimulationItem",
        component: () =>
          import(
            /* webpackChunkName: "simulations" */ "@/views/SimulationItem.vue"
          ),
      },
    ],
  },
  {
    path: "/maps",
    component: ProductTop,
    props: { title: "Maps", icon: "map", itemPageName: "MapItem" },
    children: [
      {
        path: "",
        name: "MapList",
        component: () =>
          import(/* webpackChunkName: "maps" */ "@/views/MapList.vue"),
        props: {
          productTypeName: { singular: "map", plural: "maps" },
          query: ALL_MAPS,
          queryName: "allMaps",
          productIdFieldName: "mapId",
          productItemCard: "MapItemCard",
          productAddForm: "MapAddForm",
          disableAdd: process.env.VUE_APP_ACONDBW_MAP_MUTATION_DIALOG != "true",
        },
      },
      {
        path: "item/:name",
        name: "MapItem",
        component: () =>
          import(/* webpackChunkName: "maps" */ "@/views/MapItem.vue"),
      },
    ],
  },
  {
    path: "/beams",
    component: ProductTop,
    props: {
      title: "Beams",
      icon: "mdi-spotlight-beam",
      itemPageName: "BeamItem",
    },
    children: [
      {
        path: "",
        name: "BeamList",
        component: () =>
          import(/* webpackChunkName: "beams" */ "@/views/BeamList.vue"),
      },
      {
        path: "item/:name",
        name: "BeamItem",
        component: () =>
          import(/* webpackChunkName: "beams" */ "@/views/BeamItem.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
