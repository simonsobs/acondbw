import { onMounted, onUpdated, unref } from "vue";
import type { MaybeRef } from "vue";

import Prism from "prismjs";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-latex";

export function usePrism(element: MaybeRef<HTMLElement | undefined>) {
  
  onMounted(() => {
    highlight();
  });

  onUpdated(() => {
    highlight();
  });

  function highlight() {
    const ele = unref(element);
    if (!ele) return;
    Prism.highlightAllUnder(ele);
  }
}
