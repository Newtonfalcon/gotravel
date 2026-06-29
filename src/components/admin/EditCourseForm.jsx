
"use client";

import { useState, useReducer } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, CheckCircle, AlertCircle, Loader2,
  Globe, EyeOff, Image, Tag, DollarSign, FileText,
} from "lucide-react";

const CATEGORIES = [
  "Budget Travel", "Solo Travel", "Adventure", "Photography",
  "Cultural Immersion", "Luxury Travel", "Family Travel", "Digital Nomad",
];

const PRICE_TIERS = [
  { label: "Free", value: "0" },
  { label: "$19",  value: "19" },
  { label: "$49",  value: "49" },
  { label: "$79",  value: "79" },
  { label: "$99",  value: "99" },
  { label: "$149", value: "149" },
];

function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
      {children}
      {required && <span className="text-amber-400 ml-1">*</span>}
    </label>
  );
}

function SectionCard({ children, className = "" }) {
  return (
    <div className={`bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6 ${className}`}>
      {children}
    </div>
  );
}

export default function EditCourseForm({ course, courseId }) {
  const router = useRouter();

  const [form, setForm] = useState({
    title:            course.title ?? "",
    shortDescription: course.shortDescription ?? "",
    category:         course.category ?? "",
    thumbnail:        course.thumbnail ?? "",
    status:           course.status ?? "draft",
  });

  // Price state — detect if price matches a preset tier or is custom
  const presetMatch = PRICE_TIERS.find((t) => parseFloat(t.value) === course.price);
  const [selectedTier,  setSelectedTier]  = useState(presetMatch?.value ?? "");
  const [useCustomPrice, setUseCustomPrice] = useState(!presetMatch);
  const [customPrice,   setCustomPrice]   = useState(!presetMatch ? String(course.price ?? "") : "");

  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | success | error
  const [errorMsg,   setErrorMsg]   = useState("");

  const resolvedPrice = useCustomPrice ? customPrice : selectedTier;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const descCount    = form.shortDescription.length;
  const descCountCls =
    descCount === 0       ? "text-stone-600"
    : descCount < 10      ? "text-red-400"
    : descCount > 450     ? "text-amber-400"
    : "text-stone-500";

  const isValid =
    form.title.trim().length >= 3 &&
    form.shortDescription.trim().length >= 10 &&
    resolvedPrice !== "" &&
    parseFloat(resolvedPrice) >= 0;

  async function handleSave(e) {
    e.preventDefault();
    if (!isValid || saveStatus === "saving") return;

    setSaveStatus("saving");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:            form.title.trim(),
          shortDescription: form.shortDescription.trim(),
          price:            resolvedPrice,
          category:         form.category || null,
          status:           form.status,
          thumbnail:        form.thumbnail.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        setSaveStatus("error");
        return;
      }

      setSaveStatus("success");
      // Refresh server component data — no hard navigation needed
      router.refresh();
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setErrorMsg("Network error. Check your connection and try again.");
      setSaveStatus("error");
    }
  }

  const isSaving = saveStatus === "saving";
  const isSuccess = saveStatus === "success";

  return (
    <div className="min-h-screen bg-stone-950 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/courses/${courseId}`}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to course
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-100 leading-tight">Edit Course Details</h1>
              <p className="mt-1 text-sm text-stone-500">Changes save instantly and revalidate the public listing.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">

          {/* ── Status toggle — most impactful action, put it first ─────── */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <FieldLabel>Publication status</FieldLabel>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, status: "draft" }))}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-150 ${
                  form.status === "draft"
                    ? "bg-stone-800 border-stone-600 text-stone-100"
                    : "bg-stone-950 border-stone-800 text-stone-500 hover:border-stone-700 hover:text-stone-400"
                }`}
              >
                <EyeOff className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <p className="leading-none">Draft</p>
                  <p className="text-[10px] font-normal text-stone-500 mt-1">Hidden from students</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, status: "published" }))}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-150 ${
                  form.status === "published"
                    ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
                    : "bg-stone-950 border-stone-800 text-stone-500 hover:border-stone-700 hover:text-stone-400"
                }`}
              >
                <Globe className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <p className="leading-none">Published</p>
                  <p className={`text-[10px] font-normal mt-1 ${form.status === "published" ? "text-emerald-500" : "text-stone-500"}`}>
                    Visible to students
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* ── Core fields ─────────────────────────────────────────────── */}
          <SectionCard>
            {/* Title */}
            <div>
              <FieldLabel required>Course title</FieldLabel>
              <input
                type="text"
                value={form.title}
                onChange={set("title")}
                placeholder="e.g. Budget Travel Mastery"
                maxLength={100}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors"
              />
              {form.title.length > 0 && form.title.trim().length < 3 && (
                <p className="mt-1.5 text-xs text-red-400">Title needs at least 3 characters.</p>
              )}
            </div>

            {/* Short description */}
            <div>
              <FieldLabel required>Short description</FieldLabel>
              <textarea
                value={form.shortDescription}
                onChange={set("shortDescription")}
                placeholder="What will students learn from this course?"
                rows={4}
                maxLength={500}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors resize-none leading-relaxed"
              />
              <p className={`mt-1.5 text-xs ${descCountCls} text-right`}>{descCount} / 500</p>
            </div>

            {/* Category */}
            <div>
              <FieldLabel>Category</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, category: p.category === cat ? "" : cat }))}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                      form.category === cat
                        ? "bg-amber-400 border-amber-400 text-stone-950"
                        : "bg-stone-950 border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* ── Thumbnail ───────────────────────────────────────────────── */}
          <SectionCard className="!space-y-4">
            <div>
              <FieldLabel>Thumbnail URL</FieldLabel>
              <div className="relative">
                <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600 pointer-events-none" />
                <input
                  type="url"
                  value={form.thumbnail}
                  onChange={set("thumbnail")}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-10 pr-4 py-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors"
                />
              </div>
            </div>

            {/* Preview */}
            {form.thumbnail && form.thumbnail.startsWith("http") && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-stone-800 border border-stone-700">
                <img
                  src={form.thumbnail}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-stone-600 text-xs pointer-events-none">
                  Preview
                </div>
              </div>
            )}
          </SectionCard>

          {/* ── Price ────────────────────────────────────────────────────── */}
          <SectionCard className="!space-y-4">
            <FieldLabel required>Price</FieldLabel>

            <div className="flex flex-wrap gap-2">
              {PRICE_TIERS.map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => { setUseCustomPrice(false); setSelectedTier(tier.value); }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-150 ${
                    !useCustomPrice && selectedTier === tier.value
                      ? "bg-amber-400 border-amber-400 text-stone-950"
                      : "bg-stone-950 border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => { setUseCustomPrice(true); setSelectedTier(""); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-150 ${
                  useCustomPrice
                    ? "bg-amber-400 border-amber-400 text-stone-950"
                    : "bg-stone-950 border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300"
                }`}
              >
                Custom
              </button>
            </div>

            {useCustomPrice && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 text-sm font-bold pointer-events-none">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="0.00"
                  autoFocus
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-8 pr-4 py-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors"
                />
              </div>
            )}

            {resolvedPrice !== "" && (
              <p className="text-xs text-stone-500">
                Students will be charged{" "}
                <span className="text-amber-400 font-semibold">
                  {parseFloat(resolvedPrice) === 0
                    ? "nothing — free course"
                    : `$${parseFloat(resolvedPrice).toFixed(2)}`}
                </span>
              </p>
            )}
          </SectionCard>

          {/* ── Error banner ────────────────────────────────────────────── */}
          {saveStatus === "error" && errorMsg && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">{errorMsg}</p>
            </div>
          )}

          {/* ── Actions ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-2 pb-10">
            <div className="h-9 flex items-center">
              {isSuccess && (
                <span className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  Saved
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/admin/courses/${courseId}`}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!isValid || isSaving || isSuccess}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isSuccess ? "Saved!" : isSaving ? "Saving…" : (
                  <><Save className="w-3.5 h-3.5" /> Save changes</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
