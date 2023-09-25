import { describe, expect, it } from "vitest";

import { useMarkdown } from "@/utils/markdown";
import { useEditHtml } from "../edit-html";

describe("useEditHtml()", () => {
  it("should open external links in new tab and add an icon", () => {
    const src =
      "- [link1](https://example.com/link1)\n- [link2](https://example.com/link2)";
    const { html } = useMarkdown(src);
    const parsed = useEditHtml(html);
    const expected =
      "<ul>\n" +
      "<li>" +
      '<a href="https://example.com/link1" target="_blank" rel="noopener noreferrer">' +
      "link1" +
      ' <i class="mdi mdi-open-in-new mdi v-icon notranslate v-icon--size-xsmall" aria-hidden="true"></i>' +
      "</a>" +
      "</li>\n" +
      '<li><a href="https://example.com/link2" target="_blank" rel="noopener noreferrer">' +
      "link2" +
      ' <i class="mdi mdi-open-in-new mdi v-icon notranslate v-icon--size-xsmall" aria-hidden="true"></i>' +
      "</a></li>\n" +
      "</ul>\n";
    expect(parsed.value).toBe(expected);
  });
});
