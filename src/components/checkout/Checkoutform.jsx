"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  BookOpen,
  Lock,
  ShieldCheck,
  ArrowLeft,
  Clock,
  RefreshCw,
  AlertCircle,
  CreditCard,
  Zap,
  Tag,
} from "lucide-react";

// ─── pay-state machine ────────────────────────────────────────────────────────
// idle → creating → redirecting  (then FLW redirect happens)
// (on return): idle → verifying → success | error
// special: cancelled (user hit Back on FLW page)

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressStep({ label, done, active }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
          done
            ? "bg-emerald-500"
            : active
            ? "bg-amber-500 ring-4 ring-amber-500/20"
            : "bg-gray-200"
        }`}
      >
        {done ? (
          <CheckCircle2 className="w-3 h-3 text-white" />
        ) : active ? (
          <Loader2 className="w-3 h-3 text-white animate-spin" />
        ) : null}
      </div>
      <span
        className={`text-sm transition-colors duration-300 ${
          done ? "text-gray-900 font-medium" : active ? "text-gray-900 font-semibold" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function VerifyingOverlay({ step }) {
  const steps = [
    "Confirming payment with Flutterwave",
    "Securing your course access",
    "Activating your enrollment",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05, type: "spring", stiffness: 260, damping: 22 }}
        className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8 w-full max-w-sm text-center"
      >
        {/* Animated ring */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="#f3f4f6" strokeWidth="4" />
            <motion.circle
              cx="28" cy="28" r="24"
              fill="none" stroke="#f59e0b" strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="150.8"
              initial={{ strokeDashoffset: 150.8 }}
              animate={{ strokeDashoffset: 150.8 * (1 - (step + 1) / (steps.length + 1)) }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
          </div>
        </div>

        <p className="text-lg font-bold text-gray-900 mb-1">Verifying your payment</p>
        <p className="text-sm text-gray-500 mb-6">Please don&apos;t close this window</p>

        <div className="space-y-3 text-left">
          {steps.map((label, i) => (
            <ProgressStep
              key={label}
              label={label}
              done={i < step}
              active={i === step}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SuccessView({ course, courseId, countdown }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </motion.div>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re enrolled!</h2>
        <p className="text-gray-500 mb-2 max-w-xs mx-auto">
          Payment confirmed. You now have full lifetime access to
        </p>
        <p className="font-semibold text-gray-900 mb-6 max-w-xs mx-auto">
          {course.title}
        </p>

        <Link
          href={`/courses/${courseId}/learn`}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-colors"
        >
          Start Learning
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="mt-4 text-xs text-gray-400">
          Redirecting automatically in{" "}
          <span className="font-semibold text-gray-600">{countdown}s</span>
        </p>
      </motion.div>
    </div>
  );
}

function AlreadyEnrolledView({ course, courseId }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mb-6"
      >
        <Zap className="w-10 h-10 text-amber-500" />
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Already enrolled</h2>
        <p className="text-gray-500 mb-6 max-w-xs mx-auto">
          You already have full access to{" "}
          <span className="font-semibold text-gray-700">{course.title}</span>.
        </p>
        <Link
          href={`/courses/${courseId}/learn`}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-colors"
        >
          Go to Course
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Trust bar items ──────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "SSL encrypted checkout" },
  { icon: RefreshCw, label: "30-day money-back guarantee" },
  { icon: Clock, label: "Lifetime access" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function CheckoutForm({
  course,
  courseId,
  alreadyPurchased,
  callbackData,
}) {
  const router = useRouter();

  // pay states: idle | creating | redirecting | verifying | success | error | cancelled
  const [payState, setPayState] = useState(
    callbackData?.transaction_id ? "verifying" : "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [verifyStep, setVerifyStep] = useState(0);  // 0-2 for the 3-step progress
  const [countdown, setCountdown] = useState(5);

  const countdownRef = useRef(null);

  // ── Handle auto-redirect after success ────────────────────────────────────
  useEffect(() => {
    if (payState !== "success") return;
    countdownRef.current = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(countdownRef.current);
          router.push(`/courses/${courseId}/learn`);
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [payState, courseId, router]);

  // ── Verify transaction on mount if callback params present ────────────────
  useEffect(() => {
    if (!callbackData?.transaction_id) return;

    // User explicitly cancelled on Flutterwave page
    if (callbackData.status === "cancelled") {
      setPayState("cancelled");
      return;
    }

    // Step through progress indicators
    const stepTimers = [
      setTimeout(() => setVerifyStep(1), 900),
      setTimeout(() => setVerifyStep(2), 1800),
    ];

    (async () => {
      try {
        const res = await fetch("/api/payments/flutterwave/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transaction_id: callbackData.transaction_id,
            tx_ref: callbackData.tx_ref,
          }),
        });
        const data = await res.json();

        // Ensure we've shown at least the last step before resolving
        await new Promise((r) => setTimeout(r, 600));

        if (data.success) {
          // Clean the FLW query params from the URL before showing success
          window.history.replaceState({}, "", `/checkout/${courseId}`);
          setPayState("success");
        } else {
          setPayState("error");
          setErrorMsg(data.message ?? "Verification failed. Please contact support.");
        }
      } catch {
        setPayState("error");
        setErrorMsg(
          "Network error while verifying payment. Please contact support if funds were deducted."
        );
      }
    })();

    return () => stepTimers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Initiate payment ──────────────────────────────────────────────────────
  const handlePay = useCallback(async () => {
    setPayState("creating");
    setErrorMsg("");

    try {
      const res = await fetch("/api/payments/flutterwave/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      
      const data = await res.json();
      

   

      if (!res.ok || data.error) {
        setPayState("error");
        setErrorMsg(data.error ?? "Could not start payment. Please try again.");
        return;
      }
      
      setPayState("redirecting");
      // Small delay so user sees the "Redirecting…" state before the tab navigates
      setTimeout(() => {
        window.location.href = data?.PaymentAddressLink;
      }, 300);
    } catch(error) {
      setPayState("error");
      setErrorMsg(`Network error ${error}`);
    }
  }, [courseId]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render: special full-screen states first
  // ─────────────────────────────────────────────────────────────────────────

  if (alreadyPurchased) {
    return <AlreadyEnrolledView course={course} courseId={courseId} />;
  }

  if (payState === "verifying") {
    return <VerifyingOverlay step={verifyStep} />;
  }

  if (payState === "success") {
    return <SuccessView course={course} courseId={courseId} countdown={countdown} />;
  }

  // ─── Main checkout layout ─────────────────────────────────────────────────
  const isSubmitting = payState === "creating" || payState === "redirecting";

  return (
    <main className="pt-24 sm:pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back link */}
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back to course
        </Link>

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">

          {/* ── Left: Course summary ──────────────────────────────────────── */}
          <div className="order-2 lg:order-1">
            <h1 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h1>
            
            {/* Course card */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
              {/* Thumbnail or placeholder */}
              <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
                    <BookOpen className="w-12 h-12 text-amber-300" />
                  </div>
                )}
                {course.category && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-white/90 backdrop-blur-sm border border-amber-100 px-2.5 py-1 rounded-full">
                    <Tag className="w-3 h-3" />
                    {course.category}
                  </span>
                )}
              </div>

              <div className="p-5">
                <h2 className="text-base font-bold text-gray-900 leading-snug">
                  {course.title}
                </h2>
                {course.shortDescription && (
                  <p className="mt-1.5 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {course.shortDescription}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-5 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.lessonCount ?? 0} lesson{course.lessonCount !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Lifetime access
                  </span>
                </div>
              </div>
            </div>

            {/* What's included */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">What&apos;s included</h3>
              <ul className="space-y-2">
                {[
                  "Full access to all course lessons",
                  "Downloadable resources and materials",
                  "Join a community of fellow learners",
                  "Certificate of completion",
                  "Lifetime access — learn at your own pace",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right: Payment card ───────────────────────────────────────── */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-28">
            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">

              {/* Price header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                      Total today
                    </p>
                    <p className="text-4xl font-bold text-gray-900 leading-none">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                    <Lock className="w-3 h-3" />
                    Secure checkout
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  One-time payment · No recurring charges
                </p>
              </div>

              <div className="p-6 space-y-4">

                {/* Error / cancelled banner */}
                <AnimatePresence mode="wait">
                  {(payState === "error" || payState === "cancelled") && (
                    <motion.div
                      key="error-banner"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm ${
                        payState === "cancelled"
                          ? "bg-amber-50 border-amber-100 text-amber-700"
                          : "bg-red-50 border-red-100 text-red-600"
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>
                        {payState === "cancelled"
                          ? "Payment was cancelled. You can try again below."
                          : errorMsg || "Something went wrong. Please try again."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA button */}
                <button
                  onClick={handlePay}
                  disabled={isSubmitting}
                  className="w-full relative flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-70 disabled:cursor-not-allowed text-black font-bold rounded-xl text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {payState === "redirecting"
                          ? "Opening payment page…"
                          : "Preparing payment…"}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        {course.price === 0
                          ? "Enroll for Free"
                          : `Pay $${course.price} with Flutterwave`}
                        <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {/* Powered by Flutterwave */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-[11px] text-gray-400">Powered by</span>
                  <span className="text-[11px] font-bold text-[#f5a623]">Flutterwave</span>
                  <span className="text-gray-200 text-xs">·</span>
                  <span className="text-[11px] text-gray-400">256-bit SSL</span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Trust markers */}
                <ul className="space-y-2.5">
                  {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-2.5 text-xs text-gray-500">
                      <Icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {label}
                    </li>
                  ))}
                </ul>

                {/* Accepted payment methods note */}
                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                  Cards, bank transfer, USSD & mobile money accepted via Flutterwave
                </p>
              </div>
            </div>

            {/* Help text */}
            <p className="mt-4 text-xs text-center text-gray-400">
              Having trouble?{" "}
              <a
                href="mailto:support@gotravelcourses.com"
                className="text-amber-600 hover:underline"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
