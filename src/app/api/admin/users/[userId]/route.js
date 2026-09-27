import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

const VALID_ROLES = ["user", "admin"];

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const { userId } = await params;

  if (!userId || !ObjectId.isValid(userId)) {
    return Response.json({ success: false, message: "Invalid user ID." }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const updates = {};

  if (body?.name !== undefined) {
    const name = String(body.name || "").trim();
    if (!name) {
      return Response.json({ success: false, message: "Name is required." }, { status: 400 });
    }
    updates.name = name;
  }

  if (body?.email !== undefined) {
    const email = String(body.email || "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ success: false, message: "Valid email is required." }, { status: 400 });
    }
    updates.email = email;
  }

  if (body?.role !== undefined) {
    const role = String(body.role).trim().toLowerCase();
    if (!VALID_ROLES.includes(role)) {
      return Response.json({ success: false, message: "Role must be 'user' or 'admin'." }, { status: 400 });
    }
    updates.role = role;
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ success: false, message: "No fields to update." }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("gotravel");

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ success: false, message: "User not found." }, { status: 404 });
    }

    return Response.json({ success: true, message: "User updated successfully." });
  } catch (error) {
    console.error("PATCH /api/admin/users/[userId] error:", error);
    return Response.json({ success: false, message: "Database error. Please try again." }, { status: 500 });
  }
}
