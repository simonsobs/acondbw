import { describe, expect, it } from "vitest";
import { useParsed } from "../parse";

describe("useParsed()", () => {
  it("should parse markdown", () => {
    const { parsed } = useParsed("# Hello");
    expect(parsed.value).toBe("<h1>Hello</h1>\n");
  });
});
