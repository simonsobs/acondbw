import { describe, expect, it } from "vitest";
import { useParsed } from "../parse";

describe("useParsed()", () => {
  it("should parse markdown", () => {
    const { parsed } = useParsed("# Hello");
    expect(parsed.value).toBe("<h1>Hello</h1>\n");
  });

  it("should open external links in new tab and add an icon", () => {
    // const { parsed } = useParsed("[link](https://example.com)");
    const { parsed } = useParsed(
      "- [link1](https://example.com)\n- [link2](https://example.com)"
    );
    const expected =
      "<ul>\n" +
      "<li>" +
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">' +
      "link1" +
      ' <i class="mdi mdi-open-in-new mdi v-icon notranslate v-icon--size-xsmall" aria-hidden="true"></i>' +
      "</a>" +
      "</li>\n" +
      '<li><a href="https://example.com" target="_blank" rel="noopener noreferrer">' +
      "link2" +
      ' <i class="mdi mdi-open-in-new mdi v-icon notranslate v-icon--size-xsmall" aria-hidden="true"></i>' +
      "</a></li>\n" +
      "</ul>\n";
    expect(parsed.value).toBe(expected);
  });
});
