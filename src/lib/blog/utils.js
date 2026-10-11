// src/lib/blog/utils.js
/**
 * Pure helpers shared by server and client code. No server-only imports here.
 */

export const LIMITS = {
  title: 140,
  excerpt: 240,
  body: 100_000,
  tags: 5,
  tag: 24,
  comment: 1000,
};

const WORDS_PER_MINUTE = 220;

export function stripMarkdown(markdown = "") {
  return String(markdown)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/(\*\*|__|~~|\*)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(markdown = "") {
  const text = stripMarkdown(markdown);
  return text ? text.split(" ").length : 0;
}

export function readingTime(markdown = "") {
  return Math.max(1, Math.ceil(countWords(markdown) / WORDS_PER_MINUTE));
}

export function makeExcerpt(markdown = "", max = 170) {
  const text = stripMarkdown(markdown);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:!?-]+$/, "")}…`;
}

export function normalizeTags(tags = []) {
  const seen = new Set();
  const result = [];
  for (const raw of Array.isArray(tags) ? tags : []) {
    if (typeof raw !== "string") continue;
    const tag = raw.replace(/\s+/g, " ").trim().slice(0, LIMITS.tag);
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    result.push(tag);
    if (result.length >= LIMITS.tags) break;
  }
  return result;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

export function timeAgo(iso, now = Date.now()) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(0, Math.floor((now - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + second).toUpperCase();
}

/** Stable small integer from a string, used to pick a cover fallback. */
export function hashString(value = "") {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}