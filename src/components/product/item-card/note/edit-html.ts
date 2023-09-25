import { computed, unref } from "vue";
import type { MaybeRef } from "vue";
import $ from "cash-dom";

export function useEditHtml(html: MaybeRef<string>) {
  const edited = computed(() => edit(html));
  return edited;
}

const newTabIcon =
  ' <i class="mdi mdi-open-in-new mdi v-icon notranslate v-icon--size-xsmall" aria-hidden="true"></i>';

function edit(parsed: MaybeRef<string>) {
  const tree = $(`<div>${unref(parsed)}</div>`);

  // Open external links in new tab
  tree
    .find("a[href^='http']")
    .attr("target", "_blank")
    .attr("rel", "noopener noreferrer");

  // Add an icon to links with target="_blank" on text (not img)
  // :not(:has(img)) is not supported by cash-dom
  tree.find("a[target='_blank']").each(function () {
    if ($(this).find("img").length === 0) {
      $(this).append(newTabIcon);
    }
  });

  return tree.html();
}
