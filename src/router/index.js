import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import ProductTop from "@/views/ProductTop.vue";
import ProductList from "@/views/ProductList.vue";
import ProductItem from "@/views/ProductItem.vue";

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
    path: "/simulation",
    component: ProductTop,
    props: {
      productTypeName: "simulation",
      itemPageName: "SimulationItem",
    },
    children: [
      {
        path: "",
        name: "SimulationList",
        component: ProductList,
        props: {
          productTypeId: 3,
          nameOfRouteToProductItem: "SimulationItem",
          disableAdd:
            process.env.VUE_APP_ACONDBW_SIMULATION_CREATION_DIALOG != "true",
        },
      },
      {
        path: "item/:name",
        name: "SimulationItem",
        component: ProductItem,
        props: {
          productTypeId: 3,
          routeToProductList: { name: "SimulationList" },
          nameOfRouteToProductItem: "SimulationItem",
        },
      },
    ],
  },
  {
    path: "/map",
    component: ProductTop,
    props: {
      productTypeName: "map",
      itemPageName: "MapItem",
    },
    children: [
      {
        path: "",
        name: "MapList",
        component: ProductList,
        props: {
          productTypeId: 1,
          nameOfRouteToProductItem: "MapItem",
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
          productTypeId: 1,
          routeToProductList: { name: "MapList" },
          nameOfRouteToProductItem: "MapItem",
          disableEdit: process.env.VUE_APP_ACONDBW_MAP_UPDATE_DIALOG != "true",
          disableDelete: process.env.VUE_APP_ACONDBW_MAP_DELETION_DIALOG != "true",
        },
      },
    ],
  },
  {
    path: "/beam",
    component: ProductTop,
    props: {
      productTypeName: "beam",
      itemPageName: "BeamItem",
    },
    children: [
      {
        path: "",
        name: "BeamList",
        component: ProductList,
        props: {
          productTypeId: 2,
          nameOfRouteToProductItem: "BeamItem",
          disableAdd:
            process.env.VUE_APP_ACONDBW_BEAM_CREATION_DIALOG != "true",
        },
      },
      {
        path: "item/:name",
        name: "BeamItem",
        component: ProductItem,
        props: {
          productTypeId: 2,
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
