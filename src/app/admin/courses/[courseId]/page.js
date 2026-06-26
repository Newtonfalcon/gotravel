"use client";

import { useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Video,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  FileVideo,
  X,
} from "lucide-react";

const INITIAL_FORM = { title: "", description: "", order: "", isPreview: false };
const INITIAL_UPLOAD = { status: "idle", progress: 0, loaded: 0, total: 0, speed: 0, remaining: null, error: "" };

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(s) {
  if (!s || !isFinite(s) || s <= 0) return "--";
  if (s < 60) return `${Math.round(s)}s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
      {children}
      {required && <span className="text-amber-400 ml-1">*</span>}
    </label>
  );
}

export default function CourseBuilderPage() {
  const { courseId } = useParams();
  const router = useRouter();

  const [form, setForm] = useState(INITIAL_FORM);
  const [videoFile, setVideoFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [upload, setUpload] = useState(INITIAL_UPLOAD);

  const fileInputRef = useRef(null);
  const uploadStartRef = useRef(null);
  const cancelSourceRef = useRef(null);

  const setField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const isValid =
    form.title.trim().length >= 3 &&
    form.description.trim().length >= 5 &&
    videoFile !== null;

  const handleFileSelect = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0] ?? e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setUpload((prev) => ({ ...prev, error: "Only video files are accepted." }));
      return;
    }
    setVideoFile(file);
    setUpload((prev) => ({ ...prev, error: "" }));
  }, []);

  function reset() {
    setForm(INITIAL_FORM);
    setVideoFile(null);
    setUpload(INITIAL_UPLOAD);
    uploadStartRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    uploadStartRef.current = Date.now();
    setUpload({ ...INITIAL_UPLOAD, status: "uploading" });

    const data = new FormData();
    data.append("title", form.title.trim());
    data.append("description", form.description.trim());
    data.append("video", videoFile);
    data.append("videoId", `tmp-${Date.now()}`);
    data.append("order", form.order || "0");
    data.append("isPreview", String(form.isPreview));

    const source = axios.CancelToken.source();
    cancelSourceRef.current = source;

    try {
      const res = await axios.post(
        `/api/admin/courses/${courseId}/lessons`,
        data,
        {
          cancelToken: source.token,
          onUploadProgress: (evt) => {
            const loaded = evt.loaded;
            const total = evt.total ?? videoFile.size;
            const elapsed = (Date.now() - uploadStartRef.current) / 1000;
            const speed = elapsed > 0 ? loaded / elapsed : 0;
            setUpload({
              status: "uploading",
              progress: Math.round((loaded / total) * 100),
              loaded,
              total,
              speed,
              remaining: speed > 0 ? (total - loaded) / speed : null,
              error: "",
            });
          },
        }
      );

      if (!res.data.success) {
        setUpload((prev) => ({ ...prev, status: "error", error: res.data.message || "Upload failed." }));
        return;
      }

      setUpload((prev) => ({ ...prev, status: "done" }));
      setTimeout(() => {
        reset();
        router.push("/admin/courses");
      }, 1400);
    } catch (err) {
      if (axios.isCancel(err)) { reset(); return; }
      setUpload((prev) => ({ ...prev, status: "error", error: "Upload failed. Check your connection." }));
    }
  }

  function handleCancel() {
    cancelSourceRef.current?.cancel("Cancelled by user.");
    reset();
  }

  const isUploading = upload.status === "uploading";
  const isDone = upload.status === "done";

  return (
    <div className="min-h-screen bg-stone-950 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="max-w-xl mx-auto space-y-7">

        <div>
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 active:text-amber-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Courses
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-100 leading-tight">Add Lesson</h1>
              <p className="mt-0.5 text-xs text-stone-600 font-mono tracking-wide break-all">{courseId}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-5">

            <div>
              <FieldLabel required>Lesson title</FieldLabel>
              <input
                type="text"
                value={form.title}
                onChange={setField("title")}
                placeholder="e.g. Finding Cheap Flights"
                maxLength={100}
                disabled={isUploading || isDone}
                autoComplete="off"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors disabled:opacity-50"
              />
              {form.title.length > 0 && form.title.trim().length < 3 && (
                <p className="mt-1.5 text-xs text-red-400">At least 3 characters required.</p>
              )}
            </div>

            <div>
              <FieldLabel required>Description</FieldLabel>
              <textarea
                value={form.description}
                onChange={setField("description")}
                placeholder="What does this lesson cover?"
                rows={3}
                maxLength={400}
                disabled={isUploading || isDone}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors resize-none leading-relaxed disabled:opacity-50"
              />
            </div>

            <div className="flex gap-3">
              <div className="w-24 shrink-0">
                <FieldLabel>Order</FieldLabel>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={form.order}
                  onChange={setField("order")}
                  placeholder="0"
                  disabled={isUploading || isDone}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors disabled:opacity-50"
                />
              </div>

              <div className="flex-1">
                <FieldLabel>Visibility</FieldLabel>
                <button
                  type="button"
                  disabled={isUploading || isDone}
                  onClick={() => setForm((prev) => ({ ...prev, isPreview: !prev.isPreview }))}
                  className={`w-full min-h-[46px] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-150 disabled:opacity-50 ${
                    form.isPreview
                      ? "bg-amber-400/10 border-amber-400/40 text-amber-400"
                      : "bg-stone-950 border-stone-700 text-stone-400"
                  }`}
                >
                  {form.isPreview ? <Eye className="w-4 h-4 shrink-0" /> : <EyeOff className="w-4 h-4 shrink-0" />}
                  {form.isPreview ? "Free preview" : "Enrolled only"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
            <FieldLabel required>Video file</FieldLabel>

            {!videoFile ? (
              <div
                onDrop={handleFileSelect}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
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
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  capture={false}
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="bg-stone-950 border border-stone-700 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0">
                    <FileVideo className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-100 truncate">{videoFile.name}</p>
                    <p className="text-xs text-stone-500">{formatBytes(videoFile.size)}</p>
                  </div>
                  {!isUploading && !isDone && (
                    <button
                      type="button"
                      onClick={() => setVideoFile(null)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-600 active:text-stone-300 hover:text-stone-300 transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {isDone && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                </div>

                {isUploading && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
                        <span className="text-xs font-semibold text-stone-300">Uploading…</span>
                      </div>
                      <span className="text-xs font-bold text-amber-400 tabular-nums">{upload.progress}%</span>
                    </div>

                    <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-400 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <Upload className="w-3 h-3 shrink-0" />
                        <span className="tabular-nums truncate">{formatBytes(upload.loaded)}</span>
                      </div>
                      <div className="text-center tabular-nums">
                        {formatBytes(upload.speed)}/s
                      </div>
                      <div className="flex items-center justify-end gap-1.5">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span className="tabular-nums">{formatTime(upload.remaining)}</span>
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
                  <p className="text-xs text-emerald-400 font-semibold">Upload complete — saving lesson…</p>
                )}
              </div>
            )}
          </div>

          {upload.error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">{upload.error}</p>
            </div>
          )}

          <div className="flex items-center gap-3 justify-end">
            <Link
              href="/admin/courses"
              className="px-5 py-3 rounded-xl text-sm font-semibold text-stone-400 hover:text-stone-200 active:text-stone-200 hover:bg-stone-800 active:bg-stone-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!isValid || isUploading || isDone}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 active:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2 min-h-[46px]"
            >
              {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isDone ? "Saved!" : isUploading ? "Uploading…" : "Save Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}