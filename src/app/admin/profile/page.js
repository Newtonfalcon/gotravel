import { SignOutButton } from "@clerk/nextjs";
import { Mail, ShieldCheck, UserCircle } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export const metadata = {
  title: "Profile — Admin",
};

export default async function ProfilePage() {
  const adminUser = await requireAdmin();

  return (
    <div className="min-h-screen bg-stone-950 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Admin profile</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Account details</h1>
        </div>

        <div className="rounded-3xl border border-stone-800 bg-stone-900 p-6 shadow-2xl shadow-stone-950/20">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-2xl font-bold text-amber-400">
                {adminUser?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{adminUser?.name || "Admin"}</p>
                <p className="text-sm text-stone-400">{adminUser?.role || "admin"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Administrator
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                <UserCircle className="h-3.5 w-3.5 text-amber-400" />
                Full name
              </div>
              <p className="mt-3 text-lg font-semibold text-stone-100">{adminUser?.name || "Not available"}</p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                <Mail className="h-3.5 w-3.5 text-amber-400" />
                Email address
              </div>
              <p className="mt-3 text-lg font-semibold text-stone-100">{adminUser?.email || "Not available"}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SignOutButton>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                Log out
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </div>
  );
}
