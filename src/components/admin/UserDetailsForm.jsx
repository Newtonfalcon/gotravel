"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const roleOptions = ["user", "admin"];

export default function UserDetailsForm({ user }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "user",
    isSaving: false,
    error: "",
    success: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setForm((prev) => ({ ...prev, isSaving: true, error: "", success: "" }));

    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          role: form.role,
        }),
      });

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.message || "Failed to update user.");
      }

      setForm((prev) => ({ ...prev, isSaving: false, success: "User updated successfully." }));
      router.refresh();
    } catch (error) {
      setForm((prev) => ({
        ...prev,
        isSaving: false,
        error: error.message || "Something went wrong.",
      }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-stone-800 bg-stone-900 p-6 shadow-2xl shadow-stone-950/20">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Full name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none transition focus:border-amber-400/40"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Email address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none transition focus:border-amber-400/40"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none transition focus:border-amber-400/40"
          >
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {form.error && <p className="mt-4 text-sm text-red-400">{form.error}</p>}
      {form.success && <p className="mt-4 text-sm text-emerald-400">{form.success}</p>}

      <div className="mt-6 flex items-center justify-end">
        <button
          type="submit"
          disabled={form.isSaving}
          className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {form.isSaving ? "Saving..." : "Save user"}
        </button>
      </div>
    </form>
  );
}
