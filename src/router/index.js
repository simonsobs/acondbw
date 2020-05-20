import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import ProductTop from "@/views/ProductTop.vue";
import ProductList from "@/views/ProductList.vue";
import ProductItem from "@/views/ProductItem.vue";

import SimulationItemCard from "@/components/SimulationItemCard";
import BeamItemCard from "@/components/BeamItemCard";

import MapAddForm from "@/components/MapAddForm";
import BeamAddForm from "@/components/BeamAddForm";
import SimulationAddForm from "@/components/SimulationAddForm";

Vue.component("SimulationItemCard", SimulationItemCard);
Vue.component("BeamItemCard", BeamItemCard);

Vue.component("MapAddForm", MapAddForm);
Vue.component("BeamAddForm", BeamAddForm);
Vue.component("SimulationAddForm", SimulationAddForm);

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
          productTypeId: 3,
          nameOfRouteToProductItem: "SimulationItem",
          productAddForm: "SimulationAddForm",
          disableAdd:
            process.env.VUE_APP_ACONDBW_SIMULATION_CREATION_DIALOG != "true",
        },
      },
      {
        path: "item/:name",
        name: "SimulationItem",
        component: ProductItem,
        props: {
          routeToProductList: { name: "SimulationList" },
          nameOfRouteToProductItem: "SimulationItem",
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
          productTypeId: 1,
          nameOfRouteToProductItem: "MapItem",
          productAddForm: "MapAddForm",
          disableAdd: process.env.VUE_APP_ACONDBW_MAP_CREATION_DIALOG != "true",
          disableEdit: process.env.VUE_APP_ACONDBW_MAP_UPDATE_DIALOG != "true",
          disableDelete: process.env.VUE_APP_ACONDBW_MAP_DELETION_DIALOG != "true",
        },
      },
      {
        path: "item/:name",
        name: "MapItem",
        component: ProductItem,
        props: {
          routeToProductList: { name: "MapList" },
          nameOfRouteToProductItem: "MapItem",
          disableEdit: process.env.VUE_APP_ACONDBW_MAP_UPDATE_DIALOG != "true",
          disableDelete: process.env.VUE_APP_ACONDBW_MAP_DELETION_DIALOG != "true",
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
          productTypeId: 2,
          nameOfRouteToProductItem: "BeamItem",
          productAddForm: "BeamAddForm",
          disableAdd:
            process.env.VUE_APP_ACONDBW_BEAM_CREATION_DIALOG != "true",
        },
      },
      {
        path: "item/:name",
        name: "BeamItem",
        component: ProductItem,
        props: {
          routeToProductList: { name: "BeamList" },
          nameOfRouteToProductItem: "BeamItem",
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
