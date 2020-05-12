import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import ProductTop from "@/views/ProductTop.vue";
import ProductList from "@/views/ProductList.vue";
import ProductItem from "@/views/ProductItem.vue";

import ALL_SIMULATIONS from "@/graphql/AllSimulations.gql";
import ALL_MAPS from "@/graphql/AllMaps.gql";
import ALL_BEAMS from "@/graphql/AllBeams.gql";

import SIMULATION_BY_NAME from "@/graphql/SimulationByName.gql";
import MAP_BY_NAME from "@/graphql/MapByName.gql";
import BEAM_BY_NAME from "@/graphql/BeamByName.gql";

import SimulationItemCard from "@/components/SimulationItemCard";
import MapItemCard from "@/components/MapItemCard";
import MapAddForm from "@/components/MapAddForm";
import BeamItemCard from "@/components/BeamItemCard";

Vue.component("SimulationItemCard", SimulationItemCard);
Vue.component("MapItemCard", MapItemCard);
Vue.component("MapAddForm", MapAddForm);
Vue.component("BeamItemCard", BeamItemCard);

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
      routeToProductList: { name: "SimulationList" },
      itemPageName: "SimulationItem",
    },
    children: [
      {
        path: "",
        name: "SimulationList",
        component: ProductList,
        props: {
          productTypeNameSingular: "simulation",
          productTypeNamePlural: "simulations",
          query: ALL_SIMULATIONS,
          queryName: "allSimulations",
          productIdFieldName: "simulationId",
          productItemCard: "SimulationItemCard",
          productAddForm: "SimulationAddForm",
          disableAdd: true,
        },
      },
      {
        path: "item/:name",
        name: "SimulationItem",
        component: ProductItem,
        props: {
          query: SIMULATION_BY_NAME,
          queryName: "simulation",
          routeToProductList: { name: "SimulationList" },
          productIdFieldName: "simulationId",
          productItemCard: "SimulationItemCard",
        },
      },
    ],
  },
  {
    path: "/maps",
    component: ProductTop,
    props: {
      title: "Maps",
      icon: "map",
      routeToProductList: { name: "MapList" },
      itemPageName: "MapItem",
    },
    children: [
      {
        path: "",
        name: "MapList",
        component: ProductList,
        props: {
          productTypeNameSingular: "map",
          productTypeNamePlural: "maps",
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
        component: ProductItem,
        props: {
          query: MAP_BY_NAME,
          queryName: "map",
          routeToProductList: { name: "MapList" },
          productIdFieldName: "mapId",
          productItemCard: "MapItemCard",
        },
      },
    ],
  },
  {
    path: "/beams",
    component: ProductTop,
    props: {
      title: "Beams",
      icon: "mdi-spotlight-beam",
      routeToProductList: { name: "BeamList" },
      itemPageName: "BeamItem",
    },
    children: [
      {
        path: "",
        name: "BeamList",
        component: ProductList,
        props: {
          productTypeNameSingular: "beam",
          productTypeNamePlural: "beams",
          query: ALL_BEAMS,
          queryName: "allBeams",
          productIdFieldName: "beamId",
          productItemCard: "BeamItemCard",
          productAddForm: "BeamAddForm",
          disableAdd: true,
        },
      },
      {
        path: "item/:name",
        name: "BeamItem",
        component: ProductItem,
        props: {
          query: BEAM_BY_NAME,
          queryName: "beam",
          routeToProductList: { name: "BeamList" },
          productIdFieldName: "beamId",
          productItemCard: "BeamItemCard",
        },
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
