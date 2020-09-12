import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import SignIn from "@/views/auth/SignIn.vue";
import SignInError from "@/views/auth/SignInError.vue";
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
    path: "/signin",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/signin-error",
    name: "SignInError",
    component: SignInError,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/About.vue"),
  },
  {
    path: "/:productTypeName",
    component: ProductTop,
    children: [
      {
        path: "",
        name: "ProductList",
        component: ProductList,
      },
      {
        path: "item/:name",
        name: "ProductItem",
        component: ProductItem,
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
