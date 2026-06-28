"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

// One step in the animated progress list
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
          done
            ? "text-gray-900 font-medium"
            : active
            ? "text-gray-900 font-semibold"
            : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

const VERIFY_STEPS = [
  "Confirming payment with Flutterwave",
  "Securing your course access",
  "Activating your enrollment",
];

export default function PaymentSuccessClient({ status, transaction_id, tx_ref }) {
  const router = useRouter();

  // ui states: verifying | success | error | cancelled
  const [uiState, setUiState] = useState(
    status === "cancelled" ? "cancelled" : "verifying"
  );
  const [verifyStep, setVerifyStep] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [errorMsg, setErrorMsg] = useState("");
  const countdownRef = useRef(null);

  // ── Auto-redirect countdown after success ──────────────────────────────
  useEffect(() => {
    if (uiState !== "success") return;
    countdownRef.current = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(countdownRef.current);
          router.replace("/dashboard");
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [uiState, router]);

  // ── Verify the transaction on mount ───────────────────────────────────
  useEffect(() => {
    // Nothing to verify if cancelled or no transaction id
    if (status === "cancelled" || !transaction_id) return;

    const stepTimers = [
      setTimeout(() => setVerifyStep(1), 900),
      setTimeout(() => setVerifyStep(2), 1800),
    ];

    (async () => {
      try {
        const res = await fetch("/api/payments/flutterwave/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transaction_id, tx_ref }),
        });

        const data = await res.json();

        // Give the last step time to animate before resolving
        await new Promise((r) => setTimeout(r, 700));

        if (data.success) {
          setUiState("success");
        } else {
          setUiState("error");
          setErrorMsg(
            data.error ?? "Verification failed. Please contact support."
          );
        }
      } catch {
        setUiState("error");
        setErrorMsg(
          "Network error while verifying. If funds were deducted, please contact support."
        );
      } finally {
        stepTimers.forEach(clearTimeout);
      }
    })();

    return () => stepTimers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Cancelled ─────────────────────────────────────────────────────────
  if (uiState === "cancelled") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 w-full max-w-md text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            You cancelled the payment. No charge was made.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Verifying ─────────────────────────────────────────────────────────
  if (uiState === "verifying") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 w-full max-w-md text-center"
        >
          {/* Animated progress ring */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28" cy="28" r="24"
                fill="none" stroke="#f3f4f6" strokeWidth="4"
              />
              <motion.circle
                cx="28" cy="28" r="24"
                fill="none" stroke="#f59e0b" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="150.8"
                initial={{ strokeDashoffset: 150.8 }}
                animate={{
                  strokeDashoffset:
                    150.8 * (1 - (verifyStep + 1) / (VERIFY_STEPS.length + 1)),
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
            </div>
          </div>

          <p className="text-lg font-bold text-gray-900 mb-1">
            Verifying your payment
          </p>

          {/* Key message — keep visible throughout */}
          <div className="flex items-center justify-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 mb-6">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-medium">
              Please don&apos;t close this page — verification in progress
            </span>
          </div>

          {/* Transaction reference details */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6 text-left space-y-1.5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Transaction Details
            </p>
            {transaction_id && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-gray-700 font-medium">
                  {transaction_id}
                </span>
              </div>
            )}
            {tx_ref && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Reference</span>
                <span className="font-mono text-gray-700 font-medium truncate max-w-[160px]">
                  {tx_ref}
                </span>
              </div>
            )}
            {status && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-emerald-600 capitalize">
                  {status}
                </span>
              </div>
            )}
          </div>

          {/* Step progress */}
          <div className="space-y-3 text-left">
            {VERIFY_STEPS.map((label, i) => (
              <ProgressStep
                key={label}
                label={label}
                done={i < verifyStep}
                active={i === verifyStep}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────
  if (uiState === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </motion.div>

          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Confirmed!
            </h1>
            <p className="text-gray-500 mb-6 max-w-xs mx-auto">
              Your enrollment is active. Head to your dashboard to start learning.
            </p>

            <button
              onClick={() => router.replace("/dashboard")}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-colors"
            >
              Go to Dashboard
            </button>

            <p className="mt-4 text-xs text-gray-400">
              Redirecting automatically in{" "}
              <span className="font-semibold text-gray-600">{countdown}s</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 w-full max-w-md text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Verification Failed
        </h1>
        <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
          {errorMsg || "Something went wrong verifying your payment."}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.replace("/dashboard")}
            className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-colors"
          >
            Go to Dashboard
          </button>
          <a
            href="mailto:support@gotravelcourses.com"
            className="block text-xs text-amber-600 hover:underline mt-2"
          >
            Contact support if funds were deducted
          </a>
        </div>
      </motion.div>
    </div>
  );
}