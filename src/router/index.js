import Vue from "vue";
import VueRouter from "vue-router";
import VueMeta from "vue-meta";

import store from "@/store";

import Frame from "@/components/layout/Frame.vue";
import NullFrame from "@/components/layout/NullFrame.vue";

import Home from "@/views/framework/Home.vue";
import Entry from "@/views/framework/Entry.vue";
import SearchTest from "@/views/framework/SearchTest.vue";

import OAuthRedirect from "@/views/auth/OAuthRedirect.vue";

import SignIn from "@/views/auth/SignIn.vue";
import Auth from "@/views/auth/Auth.vue";
import SignInError from "@/views/auth/SignInError.vue";

import ProductTop from "@/views/product/ProductTop.vue";
import ProductList from "@/views/product/ProductList.vue";
import ProductItem from "@/views/product/ProductItem.vue";
import ProductAdd from "@/views/product/ProductAdd.vue";

const About = () => import("@/views/framework/About.vue");
const NotFound = () => import("@/views/framework/NotFound.vue");

const FrameAdmin = () =>
  import(/* webpackChunkName: "admin" */ "@/components/admin/FrameAdmin.vue");
const Version = () =>
  import(/* webpackChunkName: "admin" */ "@/views/admin/Version.vue");
const Log = () =>
  import(/* webpackChunkName: "admin" */ "@/views/admin/Log.vue");
const Scratch = () =>
  import(/* webpackChunkName: "admin" */ "@/views/admin/Scratch.vue");
const AdminAppToken = () =>
  import(
    /* webpackChunkName: "admin" */ "@/views/admin-token/AdminAppToken.vue"
  );
const AdminAppAuth = () =>
  import(
    /* webpackChunkName: "admin" */ "@/views/admin-token/AdminAppAuth.vue"
  );
const AdminAppTokenError = () =>
  import(
    /* webpackChunkName: "admin" */ "@/views/admin-token/AdminAppTokenError.vue"
  );

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
      const signedIn = store.state.auth.isSignedIn;
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
      const signedIn = store.state.auth.isSignedIn;
      if (signedIn) {
        next();
      } else {
        next({ name: "Entry" });
      }
    },
  },
  {
    path: "/search-test",
    name: "SearchTest",
    components: { default: SearchTest, frame: Frame },
    meta: { requiresAuth: true },
  },
  {
    path: "/oauth-redirect",
    name: "OAuthRedirect",
    components: { default: OAuthRedirect, frame: NullFrame },
  },
  {
    path: "/signin",
    name: "SignIn",
    components: { default: SignIn, frame: NullFrame },
  },
  {
    path: "/auth",
    name: "Auth",
    components: { default: Auth, frame: NullFrame },
  },
  {
    path: "/signin-error",
    name: "SignInError",
    components: { default: SignInError, frame: NullFrame },
  },
  {
    path: "/admin",
    name: "Admin",
    redirect: { name: "AdminVersion" },
  },
  {
    path: "/admin/versions",
    name: "AdminVersion",
    components: { default: Version, frame: FrameAdmin },
  },
  {
    path: "/admin/log",
    name: "AdminLog",
    components: { default: Log, frame: FrameAdmin },
  },
  {
    path: "/admin/scratch",
    name: "AdminScratch",
    components: { default: Scratch, frame: FrameAdmin },
  },
  {
    path: "/admin/token",
    name: "AdminAppToken",
    components: { default: AdminAppToken, frame: FrameAdmin },
  },
  {
    path: "/admin/auth",
    name: "AdminAppAuth",
    components: { default: AdminAppAuth, frame: FrameAdmin },
  },
  {
    path: "/admin/token-error",
    name: "AdminAppTokenError",
    components: { default: AdminAppTokenError, frame: FrameAdmin },
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/add-product/:productTypeName",
    name: "ProductAdd",
    components: { default: ProductAdd, frame: NullFrame },
    meta: { requiresAuth: true },
  },
  {
    path: "/product/:productTypeName",
    components: { default: ProductTop, frame: Frame },
    meta: { requiresAuth: true },
    children: [
      { path: "", name: "ProductList", component: ProductList },
      { path: ":name", name: "ProductItem", component: ProductItem },
    ],
  },
  {
    path: "*",
    name: "NotFound",
    components: { default: NotFound, frame: NullFrame },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some((record) => record.meta.requiresAuth);
  const signedIn = store.state.auth.isSignedIn;
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

function checkAuthForCurrentRoute() {
  const authRequired = router.currentRoute.matched.some(
    (record) => record.meta.requiresAuth
  );
  const signedIn = store.state.auth.isSignedIn;
  if (authRequired && !signedIn) {
    router.push("/");
  }
}

export { router as default, router, checkAuthForCurrentRoute };
