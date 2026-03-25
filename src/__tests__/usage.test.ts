import { describe, it, expect, beforeEach } from "vitest";
import { getUsageCount, incrementUsage, canGenerate, remainingFree, resetUsage } from "../usage.js";
import { FREE_TIER_LIMIT } from "../types.js";

describe("usage tracking", () => {
  beforeEach(() => {
    resetUsage();
  });

  it("starts at 0 for new users", () => {
    expect(getUsageCount("user-1")).toBe(0);
  });

  it("increments usage count", () => {
    incrementUsage("user-1");
    expect(getUsageCount("user-1")).toBe(1);
    incrementUsage("user-1");
    expect(getUsageCount("user-1")).toBe(2);
  });

  it("tracks users independently", () => {
    incrementUsage("user-1");
    incrementUsage("user-1");
    incrementUsage("user-2");
    expect(getUsageCount("user-1")).toBe(2);
    expect(getUsageCount("user-2")).toBe(1);
  });

  it("allows generation within free limit", () => {
    expect(canGenerate("user-1", false)).toBe(true);
    for (let i = 0; i < FREE_TIER_LIMIT - 1; i++) {
      incrementUsage("user-1");
    }
    expect(canGenerate("user-1", false)).toBe(true);
  });

  it("blocks generation at free limit", () => {
    for (let i = 0; i < FREE_TIER_LIMIT; i++) {
      incrementUsage("user-1");
    }
    expect(canGenerate("user-1", false)).toBe(false);
  });

  it("pro users are never blocked", () => {
    for (let i = 0; i < FREE_TIER_LIMIT + 10; i++) {
      incrementUsage("pro-user");
    }
    expect(canGenerate("pro-user", true)).toBe(true);
  });

  it("remainingFree returns correct count", () => {
    expect(remainingFree("user-1")).toBe(FREE_TIER_LIMIT);
    incrementUsage("user-1");
    expect(remainingFree("user-1")).toBe(FREE_TIER_LIMIT - 1);
  });

  it("remainingFree returns 0 when exhausted", () => {
    for (let i = 0; i < FREE_TIER_LIMIT + 5; i++) {
      incrementUsage("user-1");
    }
    expect(remainingFree("user-1")).toBe(0);
  });
});
