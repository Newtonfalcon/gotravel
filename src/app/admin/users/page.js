import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export const metadata = {
  title: "Users — Admin",
};

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminUsersPage() {
  await requireAdmin();

  const client = await clientPromise;
  const users = await client
    .db("gotravel")
    .collection("users")
    .find({})
    .project({
      clerkId: 1,
      name: 1,
      email: 1,
      role: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div className="min-h-screen bg-stone-950 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">User management</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Users</h1>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-800 text-left">
              <thead className="bg-stone-950/70">
                <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-stone-500">
                      No users found yet.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id?.toString?.() || user.clerkId} className="hover:bg-stone-950/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">
                            {(user.name || user.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-100">{user.name || "Unnamed user"}</p>
                            <p className="text-xs text-stone-500">{user.clerkId || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-stone-300">{user.email || "—"}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                            user.role === "admin"
                              ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                              : "border-stone-700 bg-stone-800/50 text-stone-300"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-stone-400">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="inline-flex items-center rounded-xl border border-stone-700 bg-stone-950 px-3 py-2 text-xs font-semibold text-stone-200 transition hover:border-amber-400/40 hover:text-amber-300"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
