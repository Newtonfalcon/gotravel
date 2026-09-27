import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";

export default function UnderDevelopmentPage({
  title,
  description = "This admin area is currently under development and will be available in a future update.",
}) {
  return (
    <div className="min-h-screen bg-stone-950 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8 shadow-2xl shadow-stone-950/30">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300">
            <Wrench className="h-3.5 w-3.5" />
            Under development
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>

          <p className="mt-4 text-base leading-7 text-stone-300">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
