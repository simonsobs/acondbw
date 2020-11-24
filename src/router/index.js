import Vue from "vue";
import VueRouter from "vue-router";
import VueMeta from 'vue-meta';
import Home from "@/views/Home.vue";
import SignIn from "@/views/auth/SignIn.vue";
import SignInError from "@/views/auth/SignInError.vue";
import ProductTop from "@/views/product/ProductTop.vue";
import ProductList from "@/views/product/ProductList.vue";
import ProductItem from "@/views/product/ProductItem.vue";

Vue.use(VueRouter);
Vue.use(VueMeta);

const routes = [
  {
    path: "/",
    name: "Home",
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
    name: "About",
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
