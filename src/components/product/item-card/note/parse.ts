import type { MaybeRef } from "vue";

import { useMarkdown } from "@/utils/markdown";
import { useEditHtml } from "./edit-html";

export function useParsed(markdown: MaybeRef<string>) {
  const { html } = useMarkdown(markdown);
  const parsed = useEditHtml(html);
  return { parsed };
}
