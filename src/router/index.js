import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import ProductTop from "@/views/ProductTop.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/about",
    name: "about",
    component: () => import(/* webpackChunkName: "about" */ "@/views/About.vue")
  },
  {
    path: "/simulations",
    component: () => import(/* webpackChunkName: "simulations" */ "@/views/Simulations.vue"),
    children: [
      {
        path: "",
        name: "SimulationList",
        component: () =>
          import(/* webpackChunkName: "simulations" */ "@/views/SimulationList.vue")
      },
      {
        path: "item/:name",
        name: "SimulationItem",
        component: () =>
          import(/* webpackChunkName: "simulations" */ "@/views/SimulationItem.vue")
      }
    ]
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
          import(/* webpackChunkName: "maps" */ "@/views/MapList.vue")
      },
      {
        path: "item/:name",
        name: "MapItem",
        component: () =>
          import(/* webpackChunkName: "maps" */ "@/views/MapItem.vue")
      }
    ]
  },
  {
    path: "/beams",
    component: () => import(/* webpackChunkName: "beams" */ "@/views/Beams.vue"),
    children: [
      {
        path: "",
        name: "BeamList",
        component: () =>
          import(/* webpackChunkName: "beams" */ "@/views/BeamList.vue")
      },
      {
        path: "item/:name",
        name: "BeamItem",
        component: () =>
          import(/* webpackChunkName: "beams" */ "@/views/BeamItem.vue")
      }
    ]
  },
  {
    path: "/beams",
    name: "beam",
    component: () => import(/* webpackChunkName: "beams" */ "@/views/Beams.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
