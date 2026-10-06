"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Bot, MessageSquareText } from "lucide-react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function ChatWidget() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const dragState = useRef(null);

  useEffect(() => {
    const x = Math.max(16, window.innerWidth - 92);
    const y = Math.max(16, window.innerHeight - 96);
    setPosition({ x, y });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => ({
        x: clamp(current.x, 16, Math.max(16, window.innerWidth - 92)),
        y: clamp(current.y, 16, Math.max(16, window.innerHeight - 96)),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const scrollArea = document.querySelector("[data-chat-messages]");
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages, isOpen]);

  const startDragging = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest("button")) return;

    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };

    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!dragState.current) return;

      const nextX = clamp(
        dragState.current.originX + (event.clientX - dragState.current.startX),
        16,
        Math.max(16, window.innerWidth - 92)
      );
      const nextY = clamp(
        dragState.current.originY + (event.clientY - dragState.current.startY),
        16,
        Math.max(16, window.innerHeight - 96)
      );

      setPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = () => {
      dragState.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [position.x, position.y]);

  async function send() {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input.trim() }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      let json = null;

      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (json?.reply) {
        setMessages((current) => [...current, { role: "assistant", content: json.reply }]);
      } else if (res.status === 401 || json?.error === "Unauthorized") {
        setMessages((current) => [...current, { role: "assistant", content: "Please sign in to use the AI assistant." }]);
      } else if (json?.message) {
        setMessages((current) => [...current, { role: "assistant", content: json.message }]);
      } else if (json?.error) {
        setMessages((current) => [...current, { role: "assistant", content: json.error }]);
      } else if (!res.ok) {
        setMessages((current) => [...current, { role: "assistant", content: "The AI assistant could not respond right now. Please try again." }]);
      } else {
        setMessages((current) => [...current, { role: "assistant", content: "The AI assistant returned an empty response. Please try again." }]);
      }
    } catch (error) {
      console.error("Chat request failed:", error);
      setMessages((current) => [...current, { role: "assistant", content: "Something went wrong while sending your message. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        aria-label="AI chat widget"
        onPointerDown={startDragging}
        className="fixed z-50 flex h-16 w-16 items-center justify-center rounded-full border border-amber-300 bg-[#facc15] text-slate-900 shadow-[0_18px_55px_rgba(251,191,36,0.35)] transition-all duration-200 hover:scale-[1.02] active:scale-95"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: "grab",
          touchAction: "none",
        }}
      >
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-full w-full items-center justify-center rounded-full"
          aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
        >
          {isOpen ? (
            <Bot className="h-6 w-6" aria-hidden="true" />
          ) : (
            <MessageSquareText className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px]" aria-hidden="true" />
      ) : null}

      {isOpen ? (
        <div
          className="fixed z-50 w-[min(92vw,420px)] overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-[0_22px_80px_rgba(15,23,42,0.20)]"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            maxHeight: "min(75vh, 560px)",
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-900 shadow-sm">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Odaro</p>
                <p className="text-[11px] text-slate-600">
                  {user ? user.fullName || user.primaryEmailAddress?.emailAddress || "Signed in" : "Travel assistant"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div data-chat-messages className="flex max-h-[48vh] min-h-[240px] flex-col gap-3 overflow-y-auto bg-slate-50 p-4">
            {messages.length === 0 ? (
              <div className="mt-auto flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-center text-sm text-slate-500">
                Ask about relocation, courses, visas, or travel planning.
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                    message.role === "assistant"
                      ? "self-start bg-white text-slate-700"
                      : "ml-auto bg-amber-300 text-slate-900"
                  }`}
                >
                  {message.content}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <a
              href="https://wa.me/2347055333344"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              <span aria-hidden="true">💬</span>
              Chat on WhatsApp: +234 705 533 3344
            </a>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") send();
                }}
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white"
                placeholder="Ask the AI..."
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="rounded-full bg-[#facc15] px-4 py-2 font-semibold text-slate-900 transition enabled:hover:bg-[#fbbf24] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
