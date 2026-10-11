// src/components/admin/blog/BlogEditor.jsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
  ArrowLeft, Bold, Code, Eye, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered,
  Loader2, Pencil, Quote, Save, Send, Trash2, UploadCloud, X,
} from "lucide-react";
import { clsx } from "clsx";
import Markdown from "@/components/blog/Markdown";
import { uploadBlogImage } from "@/lib/blog/imageUpload";
import { LIMITS, countWords, formatDate, normalizeTags, readingTime } from "@/lib/blog/utils";

const fieldClass =
  "w-full rounded-xl border border-stone-800 bg-stone-950 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400/60 focus:ring-4 focus:ring-amber-400/10";

export default function BlogEditor({ mode = "create", initialPost = null }) {
  const router = useRouter();
  const isEdit = mode === "edit" && initialPost;

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [body, setBody] = useState(initialPost?.body ?? "");
  const [image, setImage] = useState(initialPost?.image ?? null);
  const [tags, setTags] = useState(initialPost?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState(initialPost?.status ?? "draft");

  const [tab, setTab] = useState("write");
  const [saving, setSaving] = useState(null);
  const [titleError, setTitleError] = useState("");
  const [toast, setToast] = useState(null);
  const [cover, setCover] = useState({ uploading: false, error: "" });
  const [inlineUploading, setInlineUploading] = useState(false);

  const textareaRef = useRef(null);
  const titleRef = useRef(null);
  const inlineInputRef = useRef(null);

  const snapshot = useMemo(
    () => JSON.stringify({ title, excerpt, body, image, tags }),
    [title, excerpt, body, image, tags]
  );
  const [savedSnapshot, setSavedSnapshot] = useState(snapshot);
  const dirty = snapshot !== savedSnapshot;

  const words = useMemo(() => countWords(body), [body]);
  const busy = Boolean(saving) || cover.uploading || inlineUploading;

  // ── Toasts ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(timer);
  }, [toast]);

  // ── Leave-page guard ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // ── Save ──────────────────────────────────────────────────────────────────
  async function save(target) {
    const cleanTitle = title.trim();
    if (cleanTitle.length < 3) {
      setTitleError("Give your post a title of at least 3 characters.");
      titleRef.current?.focus();
      return;
    }
    if (target === "published" && !body.trim()) {
      setToast({ type: "error", message: "Add some content before publishing." });
      return;
    }

    setSaving(target);
    setTitleError("");
    try {
      const response = await fetch(isEdit ? `/api/admin/blogs/${initialPost.id}` : "/api/admin/blogs", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          body,
          excerpt: excerpt.trim(),
          image: image || null,
          tags,
          status: target,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) throw new Error("You're signed out or not an admin. Sign in again to save.");
      if (!response.ok) throw new Error(data.message || "Couldn't save the post.");

      setStatus(target);
      setSavedSnapshot(snapshot);

      if (!isEdit) {
        router.push(target === "published" ? "/admin/blogs" : `/admin/blogs/${data.id}/edit`);
        router.refresh();
        return;
      }
      setToast({ type: "success", message: target === "published" ? "Post saved and live" : "Draft saved" });
      router.refresh();
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setSaving(null);
    }
  }

  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  });

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveRef.current(status === "published" ? "published" : "draft");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status]);

  // ── Markdown toolbar ──────────────────────────────────────────────────────
  function edit(transform) {
    const element = textareaRef.current;
    if (!element) return;
    const result = transform({ value: element.value, start: element.selectionStart, end: element.selectionEnd });
    setBody(result.value);
    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(result.start, result.end);
    });
  }

  const wrap = (before, after = before, placeholder = "text") =>
    edit(({ value, start, end }) => {
      const selected = value.slice(start, end) || placeholder;
      return {
        value: value.slice(0, start) + before + selected + after + value.slice(end),
        start: start + before.length,
        end: start + before.length + selected.length,
      };
    });

  const prefixLines = (transformLine) =>
    edit(({ value, start, end }) => {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      let lineEnd = value.indexOf("\n", end);
      if (lineEnd === -1) lineEnd = value.length;
      const lines = value.slice(lineStart, lineEnd).split("\n").map(transformLine);
      const block = lines.join("\n");
      return { value: value.slice(0, lineStart) + block + value.slice(lineEnd), start: lineStart, end: lineStart + block.length };
    });

  const heading = (level) =>
    prefixLines((line) => `${"#".repeat(level)} ${line.replace(/^#{1,6}\s+/, "")}`);

  const insertLink = () =>
    edit(({ value, start, end }) => {
      const label = value.slice(start, end) || "link text";
      const urlStart = start + label.length + 3;
      return {
        value: `${value.slice(0, start)}[${label}](https://)${value.slice(end)}`,
        start: urlStart,
        end: urlStart + "https://".length,
      };
    });

  async function insertInlineImage(file) {
    if (!file) return;
    setInlineUploading(true);
    try {
      const url = await uploadBlogImage(file);
      edit(({ value, start, end }) => {
        const alt = "Describe this image";
        const insert = `\n\n![${alt}](${url})\n\n`;
        return {
          value: value.slice(0, start) + insert + value.slice(end),
          start: start + 4,
          end: start + 4 + alt.length,
        };
      });
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setInlineUploading(false);
      if (inlineInputRef.current) inlineInputRef.current.value = "";
    }
  }

  function onEditorKeyDown(event) {
    if (!(event.metaKey || event.ctrlKey)) return;
    const key = event.key.toLowerCase();
    if (key === "b") { event.preventDefault(); wrap("**"); }
    if (key === "i") { event.preventDefault(); wrap("*"); }
    if (key === "k") { event.preventDefault(); insertLink(); }
  }

  // ── Cover image ───────────────────────────────────────────────────────────
  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected.length > 0) {
      setCover({ uploading: false, error: "Use a JPG, PNG, WebP or GIF image." });
      return;
    }
    const file = accepted[0];
    if (!file) return;
    setCover({ uploading: true, error: "" });
    try {
      setImage(await uploadBlogImage(file));
      setCover({ uploading: false, error: "" });
    } catch (error) {
      setCover({ uploading: false, error: error.message });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [], "image/gif": [] },
    multiple: false,
    maxFiles: 1,
    noClick: Boolean(image),
    noKeyboard: Boolean(image),
    disabled: cover.uploading,
  });

  // ── Tags ──────────────────────────────────────────────────────────────────
  function commitTags(raw) {
    const parts = raw.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length > 0) setTags((current) => normalizeTags([...current, ...parts]));
    setTagInput("");
  }

  function onTagKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitTags(tagInput);
    } else if (event.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((current) => current.slice(0, -1));
    }
  }

  const toolbar = [
    { label: "Heading", icon: Heading2, run: () => heading(2) },
    { label: "Subheading", icon: Heading3, run: () => heading(3) },
    { label: "Bold (Ctrl+B)", icon: Bold, run: () => wrap("**") },
    { label: "Italic (Ctrl+I)", icon: Italic, run: () => wrap("*") },
    { label: "Quote", icon: Quote, run: () => prefixLines((line) => (line.startsWith("> ") ? line : `> ${line}`)) },
    { label: "Bulleted list", icon: List, run: () => prefixLines((line) => (line.startsWith("- ") ? line : `- ${line}`)) },
    { label: "Numbered list", icon: ListOrdered, run: () => prefixLines((line, index) => `${index + 1}. ${line.replace(/^\d+\.\s+/, "")}`) },
    { label: "Link (Ctrl+K)", icon: Link2, run: insertLink },
    { label: "Code", icon: Code, run: () => wrap("`", "`", "code") },
  ];

  const isPublished = status === "published";

  return (
    <div className="min-h-full">
      {/* Sticky action bar */}
      <div className="sticky top-0 z-20 border-b border-stone-800 bg-stone-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/admin/blogs"
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-stone-400 transition hover:bg-stone-800 hover:text-stone-100"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              All posts
            </Link>
            <span className="hidden text-sm text-stone-600 sm:inline" aria-live="polite">
              {dirty ? "Unsaved changes" : isEdit ? "All changes saved" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => save("draft")}
              disabled={busy}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-stone-700 px-4 text-sm font-semibold text-stone-200 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving === "draft" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
              {isPublished ? "Unpublish" : "Save draft"}
            </button>
            <button
              type="button"
              onClick={() => save("published")}
              disabled={busy}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-amber-400 px-4 text-sm font-semibold text-stone-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving === "published" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
              {isPublished ? "Save changes" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-10 lg:py-10">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          <div>
            <label htmlFor="post-title" className="sr-only">Title</label>
            <input
              id="post-title"
              ref={titleRef}
              value={title}
              maxLength={LIMITS.title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (titleError) setTitleError("");
              }}
              placeholder="Post title"
              aria-invalid={Boolean(titleError)}
              className="w-full border-0 border-b border-stone-800 bg-transparent px-0 pb-4 text-3xl font-semibold tracking-tight text-stone-50 outline-none transition placeholder:text-stone-700 focus:border-amber-400/60 sm:text-4xl"
            />
            {titleError && <p role="alert" className="mt-2 text-sm text-red-400">{titleError}</p>}
          </div>

          <div>
            <label htmlFor="post-excerpt" className="mb-2 block text-sm font-medium text-stone-300">Summary</label>
            <textarea
              id="post-excerpt"
              value={excerpt}
              rows={2}
              maxLength={LIMITS.excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="One or two sentences shown on cards and in link previews. Leave empty to use the start of the post."
              className={clsx(fieldClass, "resize-none")}
            />
            <p className="mt-1.5 text-right text-xs tabular-nums text-stone-600">{excerpt.length}/{LIMITS.excerpt}</p>
          </div>

          {/* Editor */}
          <div className="overflow-hidden rounded-2xl border border-stone-800 bg-stone-900">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 px-3 py-2">
              <div role="tablist" aria-label="Editor mode" className="inline-flex rounded-lg bg-stone-950 p-1">
                {[
                  { id: "write", label: "Write", icon: Pencil },
                  { id: "preview", label: "Preview", icon: Eye },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={tab === id}
                    onClick={() => setTab(id)}
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      tab === id ? "bg-stone-800 text-amber-300" : "text-stone-400 hover:text-stone-200"
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>

              {tab === "write" && (
                <div className="flex flex-wrap items-center gap-0.5">
                  {toolbar.map(({ label, icon: Icon, run }) => (
                    <button
                      key={label}
                      type="button"
                      title={label}
                      aria-label={label}
                      onClick={run}
                      className="grid size-8 place-items-center rounded-md text-stone-400 transition hover:bg-stone-800 hover:text-stone-100"
                    >
                      <Icon className="size-4" />
                    </button>
                  ))}
                  <button
                    type="button"
                    title="Insert image"
                    aria-label="Insert image"
                    onClick={() => inlineInputRef.current?.click()}
                    disabled={inlineUploading}
                    className="grid size-8 place-items-center rounded-md text-stone-400 transition hover:bg-stone-800 hover:text-stone-100 disabled:opacity-50"
                  >
                    {inlineUploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
                  </button>
                  <input
                    ref={inlineInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(event) => insertInlineImage(event.target.files?.[0])}
                  />
                </div>
              )}
            </div>

            {tab === "write" ? (
              <>
                <label htmlFor="post-body" className="sr-only">Post body (Markdown)</label>
                <textarea
                  id="post-body"
                  ref={textareaRef}
                  value={body}
                  maxLength={LIMITS.body}
                  onChange={(event) => setBody(event.target.value)}
                  onKeyDown={onEditorKeyDown}
                  placeholder={"Start writing. Markdown is supported:\n\n## A heading\nSome **bold** text, a [link](https://example.com) and a list.\n\n- Step one\n- Step two"}
                  className="block min-h-[26rem] w-full resize-y bg-transparent px-5 py-4 font-mono text-[13.5px] leading-7 text-stone-100 outline-none placeholder:text-stone-600"
                />
              </>
            ) : (
              <div className="min-h-[26rem] p-4 sm:p-6">
                {body.trim() ? (
                  <div className="rounded-xl bg-white p-6 sm:p-8">
                    <Markdown source={body} size="compact" />
                  </div>
                ) : (
                  <p className="py-20 text-center text-sm text-stone-500">Nothing to preview yet. Write something first.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <section className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
            <h2 className="text-sm font-semibold text-stone-100">Cover image</h2>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">Shown on the blog and in link previews. Wide photos work best.</p>

            <div {...getRootProps()} className="mt-4 outline-none">
              <input {...getInputProps()} />
              {image ? (
                <div className="group relative overflow-hidden rounded-xl bg-stone-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Cover preview" className="aspect-[16/10] w-full object-cover" />
                  {cover.uploading && (
                    <div className="absolute inset-0 grid place-items-center bg-stone-950/70">
                      <Loader2 className="size-6 animate-spin text-amber-400" aria-label="Uploading" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-stone-950/90 to-transparent p-3 pt-8">
                    <button
                      type="button"
                      onClick={open}
                      disabled={cover.uploading}
                      className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      disabled={cover.uploading}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-red-500/80"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={clsx(
                    "flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-4 py-9 text-center transition-colors",
                    isDragActive ? "border-amber-400 bg-amber-400/10" : "border-stone-700 hover:border-stone-500",
                    cover.uploading && "pointer-events-none opacity-70"
                  )}
                >
                  {cover.uploading ? (
                    <Loader2 className="size-7 animate-spin text-amber-400" aria-hidden="true" />
                  ) : (
                    <UploadCloud className="size-7 text-stone-500" aria-hidden="true" />
                  )}
                  <p className="mt-3 text-sm font-medium text-stone-200">
                    {cover.uploading ? "Uploading" : isDragActive ? "Drop to upload" : "Drop an image or click to browse"}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">JPG, PNG, WebP or GIF</p>
                </div>
              )}
            </div>
            {cover.error && <p role="alert" className="mt-3 text-sm text-red-400">{cover.error}</p>}
          </section>

          <section className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
            <h2 className="text-sm font-semibold text-stone-100">Tags</h2>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">Up to {LIMITS.tags}. Press Enter or comma to add one.</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-stone-800 py-1 pl-2.5 pr-1 text-sm text-stone-200">
                  {tag}
                  <button
                    type="button"
                    aria-label={`Remove tag ${tag}`}
                    onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                    className="grid size-5 place-items-center rounded-md text-stone-400 transition hover:bg-stone-700 hover:text-white"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>

            {tags.length < LIMITS.tags && (
              <input
                value={tagInput}
                maxLength={LIMITS.tag}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={onTagKeyDown}
                onBlur={() => tagInput.trim() && commitTags(tagInput)}
                placeholder="e.g. Canada visa"
                aria-label="Add a tag"
                className={clsx(fieldClass, "mt-3 py-2.5")}
              />
            )}
          </section>

          <section className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
            <h2 className="text-sm font-semibold text-stone-100">Details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Status">
                <span className={isPublished ? "text-emerald-300" : "text-stone-300"}>{isPublished ? "Published" : "Draft"}</span>
              </Row>
              <Row label="Words">{words.toLocaleString("en-US")}</Row>
              <Row label="Reading time">{words === 0 ? "—" : `${readingTime(body)} min`}</Row>
              {isEdit && <Row label="Likes">{initialPost.likes}</Row>}
              {isEdit && initialPost.publishedAt && isPublished && <Row label="Published">{formatDate(initialPost.publishedAt)}</Row>}
              {isEdit && initialPost.createdAt && <Row label="Created">{formatDate(initialPost.createdAt)}</Row>}
            </dl>
            {isEdit && isPublished && (
              <Link
                href={`/blogs/${initialPost.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block rounded-xl border border-stone-700 py-2 text-center text-sm font-semibold text-stone-200 transition hover:bg-stone-800"
              >
                View on site
              </Link>
            )}
          </section>
        </aside>
      </div>

      <div aria-live="polite" className="pointer-events-none fixed bottom-6 right-6 z-50">
        {toast && (
          <p
            className={clsx(
              "pointer-events-auto rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl",
              toast.type === "error"
                ? "border-red-500/30 bg-red-950 text-red-200"
                : "border-emerald-400/30 bg-stone-900 text-emerald-300"
            )}
          >
            {toast.message}
          </p>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-stone-500">{label}</dt>
      <dd className="font-medium tabular-nums text-stone-200">{children}</dd>
    </div>
  );
}