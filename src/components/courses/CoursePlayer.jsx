"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Lock,
  PlayCircle,
  Menu,
  X,
  BookOpen,
  ExternalLink,
} from "lucide-react";

// ── Bunny video embed ────────────────────────────────────────────────────────
function BunnyPlayer({ videoId, title }) {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;

  if (!videoId) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 text-gray-500 gap-3">
        <BookOpen className="w-10 h-10 opacity-30" />
        <p className="text-sm">No video for this lesson</p>
      </div>
    );
  }

  const src = libraryId
    ? `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`
    : null;

  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-950 text-gray-500 text-sm">
        Video player unavailable
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title={title}
      allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
      allowFullScreen
      className="w-full h-full border-0"
      loading="lazy"
    />
  );
}

// ── Lesson notes renderer ────────────────────────────────────────────────────
// Parses plain text: detects URLs, bold (**text**), and line breaks
function renderNotes(text) {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const boldRegex = /\*\*(.+?)\*\*/g;

  return text.split("\n").map((line, lineIdx) => {
    if (!line.trim()) {
      return <div key={lineIdx} className="h-3" />;
    }

    // Process bold and URLs in a line
    const parts = [];
    let lastIndex = 0;
    const combined = [];

    // First pass: collect all bold and url matches with their positions
    let match;
    const allMatches = [];

    const boldRe = /\*\*(.+?)\*\*/g;
    const urlRe = /(https?:\/\/[^\s]+)/g;

    boldRe.lastIndex = 0;
    while ((match = boldRe.exec(line)) !== null) {
      allMatches.push({ type: "bold", index: match.index, end: boldRe.lastIndex, text: match[1], raw: match[0] });
    }
    urlRe.lastIndex = 0;
    while ((match = urlRe.exec(line)) !== null) {
      // Skip if inside a bold
      const inside = allMatches.some(
        (m) => m.type === "bold" && match.index >= m.index && match.index < m.end
      );
      if (!inside) {
        allMatches.push({ type: "url", index: match.index, end: urlRe.lastIndex, text: match[1], raw: match[0] });
      }
    }

    allMatches.sort((a, b) => a.index - b.index);

    let cursor = 0;
    allMatches.forEach((m, i) => {
      if (m.index > cursor) {
        parts.push(
          <span key={`t-${lineIdx}-${i}`}>{line.slice(cursor, m.index)}</span>
        );
      }
      if (m.type === "bold") {
        parts.push(
          <strong key={`b-${lineIdx}-${i}`} className="font-semibold text-gray-900">
            {m.text}
          </strong>
        );
      } else {
        // Clean trailing punctuation from URLs
        const url = m.text.replace(/[.,;!?)]+$/, "");
        const trailing = m.text.slice(url.length);
        const display = url.length > 50 ? url.slice(0, 47) + "…" : url;
        parts.push(
          <span key={`u-${lineIdx}-${i}`}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-amber-600 hover:text-amber-700 underline underline-offset-2 decoration-amber-300 hover:decoration-amber-500 transition-colors break-all"
            >
              {display}
              <ExternalLink className="w-3 h-3 shrink-0 inline ml-0.5 mb-0.5" />
            </a>
            {trailing}
          </span>
        );
      }
      cursor = m.end;
    });

    if (cursor < line.length) {
      parts.push(<span key={`tail-${lineIdx}`}>{line.slice(cursor)}</span>);
    }

    // Detect heading-like lines (start with #)
    if (line.startsWith("### ")) {
      return (
        <h3 key={lineIdx} className="text-sm font-bold text-gray-800 mt-5 mb-1.5 uppercase tracking-wide">
          {line.slice(4)}
        </h3>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={lineIdx} className="text-base font-bold text-gray-900 mt-6 mb-2">
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("# ")) {
      return (
        <h1 key={lineIdx} className="text-lg font-bold text-gray-900 mt-6 mb-2">
          {line.slice(2)}
        </h1>
      );
    }
    // Bullet points
    if (line.startsWith("- ") || line.startsWith("• ")) {
      return (
        <li key={lineIdx} className="flex gap-2 text-sm text-gray-700 leading-relaxed ml-1">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <span>{parts.length ? parts : line.slice(2)}</span>
        </li>
      );
    }

    return (
      <p key={lineIdx} className="text-sm text-gray-700 leading-relaxed">
        {parts.length ? parts : line}
      </p>
    );
  });
}

// ── Lesson sidebar item ──────────────────────────────────────────────────────
function LessonItem({ lesson, index, isActive, onSelect, completed }) {
  const canPlay = lesson.isPreview; // for now all previews are playable

  return (
    <button
      onClick={() => canPlay && onSelect(lesson)}
      disabled={!canPlay}
      className={`w-full text-left flex items-start gap-3 px-4 py-3.5 transition-all duration-150 border-l-2 ${
        isActive
          ? "bg-amber-50 border-amber-400"
          : canPlay
          ? "border-transparent hover:bg-gray-50 hover:border-gray-200"
          : "border-transparent opacity-50 cursor-not-allowed"
      }`}
    >
      {/* Index / status icon */}
      <div className="shrink-0 mt-0.5">
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-amber-500" />
        ) : isActive ? (
          <PlayCircle className="w-5 h-5 text-amber-500" />
        ) : canPlay ? (
          <Circle className="w-5 h-5 text-gray-300" />
        ) : (
          <Lock className="w-4 h-4 text-gray-300 mt-0.5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            isActive ? "text-amber-700" : canPlay ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {String(index + 1).padStart(2, "0")}. {lesson.title}
        </p>
        {lesson.isPreview && !isActive && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mt-0.5 block">
            Free Preview
          </span>
        )}
      </div>
    </button>
  );
}

// ── Main player component ────────────────────────────────────────────────────
export default function CoursePlayer({ course, lessons, initialLesson, courseId }) {
  const router = useRouter();
  const [activeLesson, setActiveLesson] = useState(initialLesson);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const notesRef = useRef(null);

  const currentIndex = lessons.findIndex((l) => l._id === activeLesson._id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const selectLesson = useCallback(
    (lesson) => {
      setActiveLesson(lesson);
      setSidebarOpen(false);
      // Scroll notes to top
      if (notesRef.current) notesRef.current.scrollTop = 0;
      // Update URL without hard navigation
      router.replace(`/courses/${courseId}/learn?lesson=${lesson._id}`, { scroll: false });
    },
    [courseId, router]
  );

  const markComplete = useCallback(() => {
    setCompletedIds((prev) => new Set([...prev, activeLesson._id]));
    if (nextLesson && nextLesson.isPreview) selectLesson(nextLesson);
  }, [activeLesson._id, nextLesson, selectLesson]);


     const handleBack = () => {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/dashboard");
      }
    };

  return (
    <div className="h-[100dvh] flex flex-col bg-gray-950 overflow-hidden">
      {/* ── Top bar ── */}
      <header className="shrink-0 h-14 flex items-center justify-between px-4 bg-gray-900 border-b border-gray-800 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={handleBack} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm shrink-0">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="w-px h-5 bg-gray-700 shrink-0" />
          <p className="text-white text-sm font-semibold truncate">{course.title}</p>
        </div>

        {/* Progress pill */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
          <span>
            {completedIds.size}/{lessons.length} complete
          </span>
          <div className="w-24 h-1.5 rounded-full bg-gray-700 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedIds.size / lessons.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle lessons"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── Body: video area + sidebar ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ── Left: video (sticky) + notes (scrollable) ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video — sticky, 16:9 capped */}
          <div className="shrink-0 w-full bg-black" style={{ aspectRatio: "16/9", maxHeight: "56vh" }}>
            <BunnyPlayer videoId={activeLesson.videoId} title={activeLesson.title} />
          </div>

          {/* Notes area — scrollable */}
          <div
            ref={notesRef}
            className="flex-1 overflow-y-auto overscroll-contain bg-white"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="max-w-3xl mx-auto px-5 sm:px-8 py-6 pb-12">
              {/* Lesson header */}
              <div className="flex items-start justify-between gap-4 mb-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">
                    Lesson {currentIndex + 1} of {lessons.length}
                  </p>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                    {activeLesson.title}
                  </h1>
                </div>
                {activeLesson.isPreview && (
                  <span className="shrink-0 mt-1 px-2.5 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest">
                    Free
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="mt-4 mb-5 h-px bg-gray-100" />

              {/* Notes content */}
              {activeLesson.description ? (
                <div className="space-y-2.5">
                  {renderNotes(activeLesson.description)}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="w-8 h-8 text-gray-200 mb-3" />
                  <p className="text-sm text-gray-400 font-medium">No notes for this lesson</p>
                  <p className="text-xs text-gray-300 mt-1">Watch the video to learn.</p>
                </div>
              )}

              {/* Lesson nav */}
              <div className="mt-10 pt-5 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                <button
                  onClick={() => prevLesson && selectLesson(prevLesson)}
                  disabled={!prevLesson}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <button
                  onClick={markComplete}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    completedIds.has(activeLesson._id)
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-amber-500 hover:bg-amber-600 text-black"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {completedIds.has(activeLesson._id) ? "Completed" : "Mark Complete"}
                </button>

                <button
                  onClick={() => nextLesson && selectLesson(nextLesson)}
                  disabled={!nextLesson}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar: lesson list ── */}
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            shrink-0 w-80 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden z-40
            lg:relative lg:translate-x-0 lg:flex
            fixed inset-y-0 right-0 transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          `}
          style={{ top: 56 }} // below header on mobile
        >
          {/* Sidebar header */}
          <div className="shrink-0 px-4 py-4 border-b border-gray-800">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-0.5">
              Course Content
            </p>
            <p className="text-sm text-white font-semibold truncate">{course.title}</p>
            <p className="text-xs text-gray-500 mt-1">
              {lessons.length} lessons · {completedIds.size} complete
            </p>
          </div>

          {/* Lesson list */}
          <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-gray-800/60">
            {lessons.map((lesson, index) => (
              <LessonItem
                key={lesson._id}
                lesson={lesson}
                index={index}
                isActive={activeLesson._id === lesson._id}
                onSelect={selectLesson}
                completed={completedIds.has(lesson._id)}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}