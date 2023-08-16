import {
  RouteRecordRaw,
  createRouter,
  createWebHistory,
  Router,
} from "vue-router";

import { useAuthStore } from "@/stores/auth";

const AppBar = () => import("@/components/layout/AppBar.vue");
const Navigation = () => import("@/components/layout/Navigation.vue");
const NavigationAdmin = () => import("@/components/admin/NavigationAdmin.vue");

const Home = () => import("@/views/framework/Home.vue");
const Entry = () => import("@/views/framework/Entry.vue");
// const SearchTest = () => import("@/views/framework/SearchTest.vue");

const OAuthRedirect = () => import("@/views/auth/OAuthRedirect.vue");

const SignIn = () => import("@/views/auth/SignIn.vue");
const Auth = () => import("@/views/auth/Auth.vue");
const SignInError = () => import("@/views/auth/SignInError.vue");

const ProductTop = () => import("@/views/product/top/ProductTop.vue");
const ProductList = () => import("@/views/product/list/ProductList.vue");
const ProductItem = () => import("@/views/product/item/ProductItem.vue");
const ProductAdd = () => import("@/views/product/ProductAdd.vue");

const ProductType = () => import("@/views/admin/ProductType.vue");

const About = () => import("@/views/framework/About.vue");
const NotFound = () => import("@/views/framework/NotFound.vue");
const SignInRequired = () => import("@/views/auth/SignInRequired.vue");
const AccessDenied = () => import("@/views/framework/AccessDenied.vue");

const Version = () => import("@/views/admin/Version.vue");
const Log = () => import("@/views/admin/Log.vue");
const Config = () => import("@/views/admin/Config.vue");
const Theme = () => import("@/views/admin/Theme.vue");
const User = () => import("@/views/admin/User.vue");
const AdminAppAuth = () => import("@/views/admin-token/AdminAppAuth.vue");
const AdminAppTokenError = () =>
  import("@/views/admin-token/AdminAppTokenError.vue");

// Path Ranker tool: https://paths.esm.dev/?p=AAMeJSyAwR4UbFDAFxAcAGAIJXMAAA..
// The route matching debugging tool

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Entry",
    component: Entry,
    beforeEnter: (to, from) => {
      const auth = useAuthStore();
      const signedIn = auth.isSignedIn;
      if (signedIn) return { name: "Dashboard" };
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    components: {
      default: Home,
      navigationDrawer: Navigation,
      appBar: AppBar,
    },
    // meta: { requiresAuth: true },
    beforeEnter: (to, from) => {
      const auth = useAuthStore();
      const signedIn = auth.isSignedIn;
      if (!signedIn) return { name: "Entry" };
    },
  },
  // {
  //   path: "/search-test",
  //   name: "SearchTest",
  //   components: { default: SearchTest, frame: Frame },
  //   meta: { requiresAuth: true },
  // },
  {
    path: "/oauth-redirect",
    name: "OAuthRedirect",
    component: OAuthRedirect,
  },
  {
    path: "/signin",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
  },
  {
    path: "/signin-error",
    name: "SignInError",
    component: SignInError,
  },
  {
    path: "/admin",
    name: "Admin",
    redirect: { name: "AdminVersion" },
  },
  {
    path: "/admin/product-type",
    name: "ProductType",
    components: {
      default: ProductType,
      navigationDrawer: NavigationAdmin,
      appBar: AppBar,
    },
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/versions",
    name: "AdminVersion",
    components: {
      default: Version,
      navigationDrawer: NavigationAdmin,
      appBar: AppBar,
    },
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/log",
    name: "AdminLog",
    components: {
      default: Log,
      navigationDrawer: NavigationAdmin,
      appBar: AppBar,
    },
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/config",
    name: "AdminConfig",
    components: {
      default: Config,
      navigationDrawer: NavigationAdmin,
      appBar: AppBar,
    },
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/theme",
    name: "AdminTheme",
    components: {
      default: Theme,
      navigationDrawer: NavigationAdmin,
      appBar: AppBar,
    },
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/users",
    name: "AdminUser",
    components: {
      default: User,
      navigationDrawer: NavigationAdmin,
      appBar: AppBar,
    },
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/auth",
    name: "AdminAppAuth",
    components: {
      default: AdminAppAuth,
      navigationDrawer: NavigationAdmin,
      appBar: AppBar,
    },
  },
  {
    path: "/admin/token-error",
    name: "AdminAppTokenError",
    components: {
      default: AdminAppTokenError,
      navigationDrawer: NavigationAdmin,
      appBar: AppBar,
    },
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/add-product/:productTypeName",
    name: "ProductAdd",
    component: ProductAdd,
    meta: { requiresAuth: true },
  },
  {
    path: "/product/:productTypeName",
    components: {
      default: ProductTop,
      navigationDrawer: Navigation,
      appBar: AppBar,
    },
    meta: { requiresAuth: true },
    children: [
      { path: "", name: "ProductList", component: ProductList },
      { path: ":name", name: "ProductItem", component: ProductItem },
    ],
  },
  {
    path: "/sign-in-required",
    name: "SignInRequired",
    component: SignInRequired,
  },
  {
    path: "/access-denied",
    name: "AccessDenied",
    component: AccessDenied,
    meta: { requiresAuth: true },
  },
  {
    path: "/*",
    name: "NotFound",
    component: NotFound,
  },
];

function createRouter_() {
  const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
    routes,
  });

  router.beforeEach((to, from) => {
    // This will be called before beforeEnter() in each route.
    // https://v3.router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards
    const adminRequired = to.matched.some((r) => r.meta.requiresAdmin);
    const authRequired =
      adminRequired || to.matched.some((r) => r.meta.requiresAuth);

    if (!(authRequired || adminRequired)) {
      return;
    }

    const auth = useAuthStore();

    const isSignedIn = auth.isSignedIn;
    if (authRequired && !isSignedIn) {
      return { name: "SignInRequired", query: { path: to.fullPath } };
    }

    const isAdmin = auth.isAdmin;
    if (adminRequired && !isAdmin) {
      return { name: "AccessDenied" };
    }
  });

  return router;
}

async function checkAuthForCurrentRoute(router: Router) {
  const authRequired = router.currentRoute.value.matched.some(
    (record) => record.meta.requiresAuth
  );
  const auth = useAuthStore();
  const signedIn = auth.isSignedIn;
  if (authRequired && !signedIn) {
    await router.push({ name: "Entry" });
  }
}

export { createRouter_, checkAuthForCurrentRoute };
