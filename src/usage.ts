/**
 * In-memory usage tracking for free tier limits.
 * In production, this would be backed by a database.
 */

import { FREE_TIER_LIMIT, type UsageRecord } from "./types.js";

const usageStore = new Map<string, UsageRecord>();

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getKey(userId: string): string {
  return `${userId}:${currentMonth()}`;
}

export function getUsageCount(userId: string): number {
  const record = usageStore.get(getKey(userId));
  return record?.count ?? 0;
}

export function incrementUsage(userId: string): number {
  const key = getKey(userId);
  const existing = usageStore.get(key);
  const newCount = (existing?.count ?? 0) + 1;
  usageStore.set(key, {
    userId,
    month: currentMonth(),
    count: newCount,
  });
  return newCount;
}

export function canGenerate(userId: string, isPro: boolean): boolean {
  if (isPro) return true;
  return getUsageCount(userId) < FREE_TIER_LIMIT;
}

export function remainingFree(userId: string): number {
  return Math.max(0, FREE_TIER_LIMIT - getUsageCount(userId));
}

/** Reset store — for testing only. */
export function resetUsage(): void {
  usageStore.clear();
}
