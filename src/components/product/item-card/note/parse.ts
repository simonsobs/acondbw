import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

export function useParsed(markdown: MaybeRefOrGetter<string>) {
  const parsed = computed(() => marked.parse(toValue(markdown)));
  return { parsed };
}
