import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import UserDetailsForm from "@/components/admin/UserDetailsForm";

export const metadata = {
  title: "User Details — Admin",
};

export default async function UserDetailsPage({ params }) {
  await requireAdmin();

  const { id } = await params;

  if (!id || !ObjectId.isValid(id)) {
    notFound();
  }

  const client = await clientPromise;
  const user = await client
    .db("gotravel")
    .collection("users")
    .findOne({ _id: new ObjectId(id) });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-950 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">User editor</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Manage user</h1>
        </div>

        <UserDetailsForm
          user={{
            ...user,
            _id: user._id.toString(),
            createdAt: user.createdAt?.toISOString?.() || user.createdAt,
            updatedAt: user.updatedAt?.toISOString?.() || user.updatedAt,
          }}
        />
      </div>
    </div>
  );
}
