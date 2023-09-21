import { unref, onMounted, onUpdated } from "vue";
import type { MaybeRef } from "vue";

export function useMathJax(element: MaybeRef<HTMLElement | undefined>) {
  onMounted(() => {
    typeset();
  });

  onUpdated(() => {
    typeset();
  });

  function typeset() {
    // @ts-ignore
    if (!window.MathJax) return;

    const ele = unref(element);
    if (!ele) return;
    try {
      // @ts-ignore
      window.MathJax.typesetPromise([ele]);
    } catch (error) {
      console.error(error);
    }
  }
}
