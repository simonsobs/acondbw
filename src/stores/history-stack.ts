import { computed, reactive } from "vue";
import { defineStore } from "pinia";
import {
  useRouter,
  RouteLocationRaw,
  RouteLocationNormalized,
} from "vue-router";

export const useHistoryStack = defineStore("historyStack", () => {
  const historyStack = reactive<RouteLocationRaw[]>([]);
  const router = useRouter();

  const afterEach = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) => {
    if (to.name !== "ProductItem") {
      historyStack.splice(0); // clear
      return;
    }

    if (!historyStack.length && from.name === "ProductList") {
      // push "from" so that we can move back to "list"
      const pushArg = toPushArg(from);
      historyStack.push(pushArg);
    }

    const pushArg = toPushArg(to);
    if (isSamePathAsLast(pushArg)) return; // Always true while moving back.

    historyStack.push(pushArg);
  };

  /**
   * Return true if the same as the last item in the history stack
   */
  function isSamePathAsLast(arg: RouteLocationRaw) {
    if (!historyStack.length) return false;
    return isSamePath(historyStack[historyStack.length - 1], arg);
  }

  /**
   * Return true if two routes resolved to the same path
   *
   * @see https://router.vuejs.org/guide/essentials/route-matching-syntax.html
   */
  function isSamePath(r1: RouteLocationRaw, r2: RouteLocationRaw) {
    return router.resolve(r1).href === router.resolve(r2).href;
  }

  /**
   * Convert an argument of afterEach() to an argument of router.push()
   *
   * @see https://router.vuejs.org/guide/essentials/navigation.html
   */
  function toPushArg(arg: RouteLocationNormalized): RouteLocationRaw {
    return { path: arg.path };
  }

  const hasBack = computed(() => historyStack.length >= 2);

  function back() {
    if (!hasBack.value) return;
    historyStack.pop();
    router.push(historyStack[historyStack.length - 1]);
  }

  return {
    historyStack,
    afterEach,
    back,
    hasBack,
  };
});
