import { describe, expect, it } from "vitest";

import { useMarkdown } from "@/utils/markdown";
import { useEditHtml } from "../edit-html";

describe("useEditHtml()", () => {
  it("should open external links in new tab and add an icon", () => {
    const src =
      "- [link1](https://example.com/link1)\n- [link2](https://example.com/link2)";
    const { html } = useMarkdown(src);
    const edited = useEditHtml(html);
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
    expect(edited.value).toBe(expected);
  });

  it("should not add an icon to links with target='_blank' on img", () => {
    const src =
      "- [<img src='https://example.com/image.png'>](https://example.com/image.png)";
    const { html } = useMarkdown(src);
    const edited = useEditHtml(html);
    const expected =
      "<ul>\n" +
      "<li>" +
      '<a href="https://example.com/image.png" target="_blank" rel="noopener noreferrer">' +
      '<img src="https://example.com/image.png">' +
      "</a></li>\n" +
      "</ul>\n";
    expect(edited.value).toBe(expected);

  });
});
