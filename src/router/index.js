import Vue from "vue";
import VueRouter from "vue-router";
import VueMeta from 'vue-meta';
import Frame from "@/components/layout/Frame";
import NullFrame from "@/components/layout/NullFrame";
import Home from "@/views/Home.vue";
import Entry from "@/views/Entry.vue";
import SignIn from "@/views/auth/SignIn.vue";
import SignInError from "@/views/auth/SignInError.vue";
import ProductTop from "@/views/product/ProductTop.vue";
import ProductList from "@/views/product/ProductList.vue";
import ProductItem from "@/views/product/ProductItem.vue";
import store from "@/store"
Vue.use(VueRouter);
Vue.use(VueMeta);

const routes = [
  {
    path: "/",
    name: "Entry",
    components: {
      default: Entry,
      frame: NullFrame
     },
     beforeEnter: (to, from, next) => {
       const signedIn = store.state.token;
       console.log(signedIn);
       console.log("router");
       if(signedIn) {
        next({ name: "Dashboard"});
       } else {
        next();
       }
     }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    components: {
      default: Home,
      frame: Frame
     },
     beforeEnter: (to, from, next) => {
      const signedIn = store.state.token;
      if(signedIn) {
        next();
      } else {
        next({ name: "Entry"});
      }
   }
  },
  {
    path: "/signin",
    name: "SignIn",
    components: {
      default: SignIn,
      frame: NullFrame
     }
  },
  {
    path: "/signin-error",
    name: "SignInError",
    components: {
      default: SignInError,
      frame: NullFrame
     }
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/About.vue"),
  },
  {
    path: "/:productTypeName",
    components: {
      default: ProductTop,
      frame: Frame
     },
    meta: { requiresAuth: true },
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
