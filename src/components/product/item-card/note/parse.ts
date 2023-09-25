import { computed, unref } from "vue";
import type { MaybeRef } from "vue";
import $ from "cash-dom";

import { useMarkdown } from "@/utils/markdown";

export function useParsed(markdown: MaybeRef<string>) {
  const { html: _parsed } = useMarkdown(unref(markdown));
  const parsed = useEditHtml(_parsed);
  return { parsed };
}

function useEditHtml(html: MaybeRef<string>) {
  const edited = computed(() => edit(html));
  return edited;
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
