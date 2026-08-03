import { describe, expect, it } from "vitest";
import { parseTags, slugify, truncate } from "./text-utils.js";

describe("slugify", () => {
  it("lowercases and hyphenates a plain title", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("collapses punctuation and extra spaces into single hyphens", () => {
    expect(slugify("  AI Tools: A Comparison!! ")).toBe("ai-tools-a-comparison");
  });
});

describe("parseTags", () => {
  it("splits on commas and hashes, trims, lowercases, and dedupes", () => {
    expect(parseTags("#AI, Tools,#ai, dev ")).toEqual(["ai", "tools", "dev"]);
  });

  it("returns an empty array for blank input", () => {
    expect(parseTags("   ")).toEqual([]);
  });
});

describe("truncate", () => {
  it("returns the input unchanged when it is already within maxLength", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates long input and appends the suffix", () => {
    const result = truncate("hello world", 5);
    expect(result.length).toBeLessThan("hello world".length);
    expect(result.endsWith("...")).toBe(true);
  });

  // BUG-101 regression: the suffix must be counted against maxLength,
  // so the returned string never exceeds the limit.
  it("counts the suffix against maxLength (BUG-101)", () => {
    const result = truncate("a long sentence here", 10, "...");
    expect(result).toBe("a long ...");
    expect(result.length).toBe(10);
  });

  it("never returns a string longer than maxLength", () => {
    const samples: Array<[string, number, string]> = [
      ["a long sentence here", 10, "..."],
      ["hello world", 5, "..."],
      ["hello world", 8, "…"],
      ["abcdefghij", 1, "..."],
    ];

    for (const [input, maxLength, suffix] of samples) {
      expect(truncate(input, maxLength, suffix).length).toBeLessThanOrEqual(maxLength);
    }
  });

  it("returns the suffix clipped to maxLength when suffix is not shorter than maxLength", () => {
    expect(truncate("a long sentence here", 3, "...")).toBe("...");
    expect(truncate("a long sentence here", 2, "...")).toBe("..".slice(0, 2));
    expect(truncate("a long sentence here", 0, "...")).toBe("");
  });
});
