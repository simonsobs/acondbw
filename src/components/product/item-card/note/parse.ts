import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { marked } from "marked";

export function useParsed(markdown: MaybeRefOrGetter<string>) {
  const parsed = computed(() => marked(toValue(markdown)));
  return { parsed };
}
