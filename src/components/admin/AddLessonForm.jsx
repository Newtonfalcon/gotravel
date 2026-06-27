"use client";

import { useReducer, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Video, Eye, EyeOff, Upload, CheckCircle, AlertCircle,
  Loader2, Clock, FileVideo, X,
} from "lucide-react";

// ── State ────────────────────────────────────────────────────────────────────
const INIT = {
  title: "",
  description: "",
  order: "",
  isPreview: false,
  file: null,
  status: "idle", // idle | uploading | done | error
  progress: 0,
  loaded: 0,
  total: 0,
  speed: 0,
  remaining: null,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "FIELD":
      return { ...state, [action.key]: action.value };
    case "FILE":
      return { ...state, file: action.file, error: "" };
    case "CLEAR_FILE":
      return { ...state, file: null };
    case "UPLOADING":
      return { ...state, status: "uploading", progress: 0, error: "" };
    case "PROGRESS":
      return { ...state, ...action.payload, status: "uploading" };
    case "DONE":
      return { ...state, status: "done" };
    case "ERROR":
      return { ...state, status: "error", error: action.error };
    case "RESET":
      return INIT;
    default:
      return state;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtBytes(b) {
  if (!b) return "0 B";
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtTime(s) {
  if (!s || !isFinite(s) || s <= 0) return "--";
  if (s < 60) return `${Math.round(s)}s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
}

function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
      {children}
      {required && <span className="text-amber-400 ml-1">*</span>}
    </label>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
export default function AddLessonForm({ courseId }) {
  const router = useRouter();
  const [s, dispatch] = useReducer(reducer, INIT);

  const fileRef = useRef(null);
  const startRef = useRef(null);
  const cancelRef = useRef(null);

  const isUploading = s.status === "uploading";
  const isDone = s.status === "done";
  const isDisabled = isUploading || isDone;

  const isValid =
    s.title.trim().length >= 3 &&
    s.description.trim().length >= 5 &&
    s.file !== null;

  // ── File pick / drop ──────────────────────────────────────────────────────
  const handleFile = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] ?? e.target?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      dispatch({ type: "ERROR", error: "Only video files are accepted." });
      return;
    }
    dispatch({ type: "FILE", file });
  }, []);

  const [dragOver, setDragOver] = useReducer((_, v) => v, false);

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || isDisabled) return;

    startRef.current = Date.now();
    dispatch({ type: "UPLOADING" });

    const data = new FormData();
    data.append("title", s.title.trim());
    data.append("description", s.description.trim());
    data.append("video", s.file);
    data.append("videoId", `tmp-${Date.now()}`);
    data.append("order", s.order || "0");
    data.append("isPreview", String(s.isPreview));

    const source = axios.CancelToken.source();
    cancelRef.current = source;

    try {
      const res = await axios.post(
        `/api/admin/courses/${courseId}/lessons`,
        data,
        {
          cancelToken: source.token,
          onUploadProgress(evt) {
            const loaded = evt.loaded;
            const total = evt.total ?? s.file.size;
            const elapsed = (Date.now() - startRef.current) / 1000;
            const speed = elapsed > 0 ? loaded / elapsed : 0;
            dispatch({
              type: "PROGRESS",
              payload: {
                progress: Math.round((loaded / total) * 100),
                loaded,
                total,
                speed,
                remaining: speed > 0 ? (total - loaded) / speed : null,
              },
            });
          },
        }
      );

      if (!res.data?.success) {
        dispatch({ type: "ERROR", error: res.data?.message || "Upload failed." });
        return;
      }

      dispatch({ type: "DONE" });
      setTimeout(() => {
        dispatch({ type: "RESET" });
        if (fileRef.current) fileRef.current.value = "";
        // Refresh server component data without full navigation
        router.refresh();
      }, 1400);
    } catch (err) {
      if (axios.isCancel(err)) {
        dispatch({ type: "RESET" });
        if (fileRef.current) fileRef.current.value = "";
        return;
      }
      dispatch({ type: "ERROR", error: "Upload failed. Check your connection and try again." });
    }
  }

  function handleCancel() {
    cancelRef.current?.cancel("Cancelled by user.");
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Fields */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-5">
        {/* Title */}
        <div>
          <Label required>Lesson title</Label>
          <input
            type="text"
            value={s.title}
            onChange={(e) => dispatch({ type: "FIELD", key: "title", value: e.target.value })}
            placeholder="e.g. Finding Cheap Flights"
            maxLength={100}
            disabled={isDisabled}
            autoComplete="off"
            className="w-full h-11 bg-stone-950 border border-stone-700 rounded-xl px-4 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors disabled:opacity-50"
          />
          {s.title.length > 0 && s.title.trim().length < 3 && (
            <p className="mt-1.5 text-xs text-red-400">At least 3 characters required.</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label required>Description</Label>
          <textarea
            value={s.description}
            onChange={(e) => dispatch({ type: "FIELD", key: "description", value: e.target.value })}
            placeholder="What does this lesson cover?"
            rows={3}
            maxLength={400}
            disabled={isDisabled}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors resize-none leading-relaxed disabled:opacity-50"
          />
        </div>

        {/* Order + Visibility */}
        <div className="flex gap-3">
          <div className="w-24 shrink-0">
            <Label>Order</Label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={s.order}
              onChange={(e) => dispatch({ type: "FIELD", key: "order", value: e.target.value })}
              placeholder="1"
              disabled={isDisabled}
              className="w-full h-11 bg-stone-950 border border-stone-700 rounded-xl px-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors disabled:opacity-50"
            />
          </div>

          <div className="flex-1">
            <Label>Visibility</Label>
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => dispatch({ type: "FIELD", key: "isPreview", value: !s.isPreview })}
              className={`w-full h-11 flex items-center gap-2.5 px-4 rounded-xl border text-sm font-semibold transition-all duration-150 disabled:opacity-50 ${
                s.isPreview
                  ? "bg-amber-400/10 border-amber-400/40 text-amber-400"
                  : "bg-stone-950 border-stone-700 text-stone-400"
              }`}
            >
              {s.isPreview
                ? <Eye className="w-4 h-4 shrink-0" />
                : <EyeOff className="w-4 h-4 shrink-0" />}
              {s.isPreview ? "Free preview" : "Enrolled only"}
            </button>
          </div>
        </div>
      </div>

      {/* Video upload */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
        <Label required>Video file</Label>

        {!s.file ? (
          <div
            onDrop={handleFile}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl py-10 cursor-pointer select-none transition-colors duration-150 ${
              dragOver
                ? "border-amber-400 bg-amber-400/5"
                : "border-stone-700 bg-stone-950 active:border-amber-400/60"
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center">
              <FileVideo className="w-5 h-5 text-stone-500" />
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-semibold text-stone-300">Tap to browse or drop video here</p>
              <p className="mt-1 text-xs text-stone-600">MP4, MOV, WebM · any size</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        ) : (
          <div className="bg-stone-950 border border-stone-700 rounded-xl p-4 space-y-4">
            {/* File header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0">
                <FileVideo className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-100 truncate">{s.file.name}</p>
                <p className="text-xs text-stone-500">{fmtBytes(s.file.size)}</p>
              </div>
              {!isUploading && !isDone && (
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: "CLEAR_FILE" });
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  aria-label="Remove file"
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-600 active:text-stone-300 hover:text-stone-300 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isDone && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
            </div>

            {/* Progress */}
            {isUploading && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
                    <span className="text-xs font-semibold text-stone-300">Uploading…</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400 tabular-nums">{s.progress}%</span>
                </div>

                <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${s.progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Upload className="w-3 h-3 shrink-0" />
                    <span className="tabular-nums truncate">{fmtBytes(s.loaded)}</span>
                  </div>
                  <div className="text-center tabular-nums">{fmtBytes(s.speed)}/s</div>
                  <div className="flex items-center justify-end gap-1.5">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span className="tabular-nums">{fmtTime(s.remaining)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs text-red-400 active:text-red-300 hover:text-red-300 font-semibold transition-colors"
                >
                  Cancel upload
                </button>
              </div>
            )}

            {isDone && (
              <p className="text-xs text-emerald-400 font-semibold">
                Upload complete — saving lesson…
              </p>
            )}
          </div>
        )}
      </div>

      {/* Error banner */}
      {s.status === "error" && s.error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-400">{s.error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          disabled={isUploading}
          onClick={() => {
            dispatch({ type: "RESET" });
            if (fileRef.current) fileRef.current.value = "";
          }}
          className="h-11 px-5 rounded-xl text-sm font-semibold text-stone-400 active:text-stone-200 hover:text-stone-200 hover:bg-stone-800 active:bg-stone-800 transition-colors disabled:opacity-40"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={!isValid || isDisabled}
          className="h-11 px-6 rounded-xl text-sm font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 active:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2 min-w-[120px] justify-center"
        >
          {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isDone ? "Saved!" : isUploading ? "Uploading…" : "Save Lesson"}
        </button>
      </div>
    </form>
  );
}