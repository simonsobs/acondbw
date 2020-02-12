import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/maps/item/:name",
    name: "MapItem",
    component: () => import(/* webpackChunkName: "mapItem" */ "../views/MapItem.vue")
  },
  {
    path: "/maps",
    name: "map",
    component: () => import(/* webpackChunkName: "maps" */ "../views/Maps.vue")
  },
  {
    path: "/beams",
    name: "beam",
    component: () => import(/* webpackChunkName: "beams" */ "../views/Beams.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
