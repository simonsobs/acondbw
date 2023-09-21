import { computed, unref, toValue } from "vue";
import type { ComputedRef, MaybeRef, MaybeRefOrGetter } from "vue";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import $ from "cash-dom";

const marked = new Marked({
  gfm: true,
  ...markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
});

export function useParsed(markdown: MaybeRefOrGetter<string>) {
  const _parsed = computed(() =>
    marked.parse(toValue(markdown))
  ) as ComputedRef<string>;
  const parsed = computed(() => edit(_parsed));
  return { parsed };
}

function edit(parsed: MaybeRef<string>) {
  const tree = $(`<div>${unref(parsed)}</div>`);

  // Open external links in new tab
  tree
    .find("a[href^='http']")
    .attr("target", "_blank")
    .attr("rel", "noopener noreferrer");

  // Add mdi-open-in-new icon to links with target="_blank" on text (not img)
  tree
    .find("a[target='_blank']")
    .append(
      ' <i class="mdi mdi-open-in-new mdi v-icon notranslate v-icon--size-xsmall" aria-hidden="true"></i>'
    );

  return tree.html();
}
