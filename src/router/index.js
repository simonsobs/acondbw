import Vue from "vue";
import VueRouter from "vue-router";
import VueMeta from "vue-meta";

import Frame from "@/components/layout/Frame";
import NullFrame from "@/components/layout/NullFrame";

import Home from "@/views/framework/Home.vue";
import Entry from "@/views/framework/Entry.vue";

import OAuthRedirect from "@/views/auth/OAuthRedirect.vue"

import SignIn from "@/views/auth/SignIn.vue";
import Auth from "@/views/auth/Auth.vue";
import SignInError from "@/views/auth/SignInError.vue";

import ProductTop from "@/views/product/ProductTop.vue";
import ProductList from "@/views/product/ProductList.vue";
import ProductItem from "@/views/product/ProductItem.vue";
import ProductAdd from "@/views/product/ProductAdd.vue";

import store from "@/store";

Vue.use(VueRouter);
Vue.use(VueMeta);

const routes = [
  {
    path: "/",
    name: "Entry",
    components: {
      default: Entry,
      frame: NullFrame,
    },
    beforeEnter: (to, from, next) => {
      const signedIn = !!store.state.auth.token;
      if (signedIn) {
        next({ name: "Dashboard" });
      } else {
        next();
      }
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    components: {
      default: Home,
      frame: Frame,
    },
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const signedIn = !!store.state.auth.token;
      if (signedIn) {
        next();
      } else {
        next({ name: "Entry" });
      }
    },
  },
  {
    path: "/oauth-redirect",
    name: "OAuthRedirect",
    components: {
      default: OAuthRedirect,
      frame: NullFrame,
    },
  },
  {
    path: "/signin",
    name: "SignIn",
    components: {
      default: SignIn,
      frame: NullFrame,
    },
  },
  {
    path: "/auth",
    name: "Auth",
    components: {
      default: Auth,
      frame: NullFrame,
    },
  },
  {
    path: "/signin-error",
    name: "SignInError",
    components: {
      default: SignInError,
      frame: NullFrame,
    },
  },
  {
    path: "/admin/scratch",
    name: "AdminScratch",
    components: {
      default: () =>
        import(
          /* webpackChunkName: "admin" */ "@/views/admin-token/Scratch"
        ),
      frame: () =>
        import(
          /* webpackChunkName: "admin" */ "@/components/layout/FrameAdmin"
        ),
    },
  },
  {
    path: "/admin/token",
    name: "AdminAppToken",
    components: {
      default: () =>
        import(
          /* webpackChunkName: "admin" */ "@/views/admin-token/AdminAppToken"
        ),
      frame: () =>
        import(
          /* webpackChunkName: "admin" */ "@/components/layout/FrameAdmin"
        ),
    },
  },
  {
    path: "/admin/auth",
    name: "AdminAppAuth",
    components: {
      default: () =>
        import(
          /* webpackChunkName: "admin" */ "@/views/admin-token/AdminAppAuth"
        ),
        frame: () =>
        import(
          /* webpackChunkName: "admin" */ "@/components/layout/FrameAdmin"
        ),
    },
  },
  {
    path: "/admin/token-error",
    name: "AdminAppTokenError",
    components: {
      default: () =>
        import(
          /* webpackChunkName: "admin" */ "@/views/admin-token/AdminAppTokenError"
        ),
        frame: () =>
        import(
          /* webpackChunkName: "admin" */ "@/components/layout/FrameAdmin"
        ),
    },
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/framework/About.vue"),
  },
  {
    path: "/add-product/:productTypeName",
    components: {
      default: ProductAdd,
      frame: NullFrame,
    },
    meta: { requiresAuth: true }
  },
  {
    path: "/product/:productTypeName",
    components: {
      default: ProductTop,
      frame: Frame,
    },
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "ProductList",
        component: ProductList,
      },
      {
        path: ":name",
        name: "ProductItem",
        component: ProductItem,
      },
    ],
  },
  {
    path: "*",
    name: "NotFound",
    components: {
      default: () =>
        import(/* webpackChunkName: "error" */ "@/views/framework/NotFound.vue"),
        frame: NullFrame,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some((record) => record.meta.requiresAuth);
  const signedIn = !!store.state.auth.token;
  if (authRequired) {
    if (signedIn) {
      next();
    } else {
      next("/");
    }
  } else {
    next();
  }
});

export default router;
