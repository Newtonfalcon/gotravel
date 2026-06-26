"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const CATEGORIES = [
  "Budget Travel",
  "Solo Travel",
  "Adventure",
  "Photography",
  "Cultural Immersion",
  "Luxury Travel",
  "Family Travel",
  "Digital Nomad",
];

const PRICE_TIERS = [
  { label: "Free", value: "0" },
  { label: "$19", value: "19" },
  { label: "$49", value: "49" },
  { label: "$79", value: "79" },
  { label: "$99", value: "99" },
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

function StatusBadge({ status }) {
  const map = {
    idle: null,
    loading: (
      <div className="flex items-center gap-2 text-stone-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Creating course…</span>
      </div>
    ),
    success: (
      <div className="flex items-center gap-2 text-emerald-400 text-sm">
        <CheckCircle className="w-4 h-4" />
        <span>Course created</span>
      </div>
    ),
    error: null,
  };
  return map[status] ?? null;
}

export default function CreateCoursePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  const [customPrice, setCustomPrice] = useState("");
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const resolvedPrice = useCustomPrice ? customPrice : form.price;

  const isValid =
    form.title.trim().length >= 3 &&
    form.description.trim().length >= 10 &&
    resolvedPrice !== "" &&
    parseFloat(resolvedPrice) >= 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          price: resolvedPrice,
          category: form.category || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong. Try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setTimeout(() => {
        router.push(`/admin/courses/${data?.data?.courseId}`);
      }, 1200);
    } catch {
      setError("Network error. Check your connection and try again.");
      setStatus("error");
    }
  }

  const charCount = form.description.length;
  const descColor =
    charCount === 0
      ? "text-stone-600"
      : charCount < 10
      ? "text-red-400"
      : charCount > 400
      ? "text-amber-400"
      : "text-stone-500";

  return (
    <div className="min-h-screen bg-stone-950 px-6 py-8 lg:px-10 lg:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Courses
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-100 leading-tight">
                New Course
              </h1>
              <p className="mt-1 text-sm text-stone-500">
                Published as a draft — add lessons before going live.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
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
                <p className="mt-1.5 text-xs text-red-400">
                  Title needs at least 3 characters.
                </p>
              )}
            </div>

            <div>
              <FieldLabel required>Short description</FieldLabel>
              <textarea
                value={form.description}
                onChange={set("description")}
                placeholder="What will students learn and take away from this course?"
                rows={4}
                maxLength={500}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors resize-none leading-relaxed"
              />
              <p className={`mt-1.5 text-xs ${descColor} text-right`}>
                {charCount} / 500
              </p>
            </div>

            <div>
              <FieldLabel>Category</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        category: prev.category === cat ? "" : cat,
                      }))
                    }
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
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <FieldLabel required>Price</FieldLabel>

            <div className="flex flex-wrap gap-2 mb-4">
              {PRICE_TIERS.map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => {
                    setUseCustomPrice(false);
                    setForm((prev) => ({ ...prev, price: tier.value }));
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-150 ${
                    !useCustomPrice && form.price === tier.value
                      ? "bg-amber-400 border-amber-400 text-stone-950"
                      : "bg-stone-950 border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setUseCustomPrice(true);
                  setForm((prev) => ({ ...prev, price: "" }));
                }}
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
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 text-sm font-bold">
                  $
                </span>
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
              <p className="mt-3 text-xs text-stone-500">
                Students will be charged{" "}
                <span className="text-amber-400 font-semibold">
                  {parseFloat(resolvedPrice) === 0
                    ? "nothing — this course is free"
                    : `$${parseFloat(resolvedPrice).toFixed(2)}`}
                </span>
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <StatusBadge status={status} />

            <div className="flex items-center gap-3 ml-auto">
              <Link
                href="/admin/courses"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!isValid || status === "loading" || status === "success"}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
              >
                {status === "loading" && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                {status === "success" ? "Created!" : "Create Course"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}