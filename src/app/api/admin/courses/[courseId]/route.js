
//this is for the patch, i might change this 


import { revalidateTag } from "next/cache";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

const ALLOWED_STATUSES  = ["draft", "published"];
const ALLOWED_CATEGORIES = [
  "Budget Travel", "Solo Travel", "Adventure", "Photography",
  "Cultural Immersion", "Luxury Travel", "Family Travel", "Digital Nomad",
];

export async function PATCH(request, { params }) {

    console.log("we are here");
    
  // ── Auth guard (fixes the API-route auth gap) ──────────────────────────
  try {
    await requireAdmin();
  } catch {
    return Response.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const { courseId } = await params;

  if (!courseId || !ObjectId.isValid(courseId)) {
    return Response.json({ success: false, message: "Invalid course ID." }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const { title, shortDescription, price, category, status, thumbnail } = body;

  const $set   = { updatedAt: new Date() };
  const errors = [];

  if (title !== undefined) {
    const t = String(title).trim();
    if (t.length < 3) errors.push("Title must be at least 3 characters.");
    else $set.title = t;
  }

  if (shortDescription !== undefined) {
    const d = String(shortDescription).trim();
    if (d.length < 10) errors.push("Description must be at least 10 characters.");
    else if (d.length > 500) errors.push("Description cannot exceed 500 characters.");
    else $set.shortDescription = d;
  }

  if (price !== undefined) {
    const p = parseFloat(price);
    if (isNaN(p) || p < 0) errors.push("Price must be a non-negative number.");
    else $set.price = p;
  }

  if (category !== undefined) {
    if (category !== null && !ALLOWED_CATEGORIES.includes(category)) {
      errors.push("Invalid category value.");
    } else {
      $set.category = category ?? null;
    }
  }

  if (status !== undefined) {
    if (!ALLOWED_STATUSES.includes(status)) {
      errors.push(`Status must be one of: ${ALLOWED_STATUSES.join(", ")}.`);
    } else {
      $set.status = status;
    }
  }

  if (thumbnail !== undefined) {
    if (thumbnail && !thumbnail.startsWith("http")) {
      errors.push("Thumbnail must be a valid http/https URL or empty.");
    } else {
      $set.thumbnail = thumbnail || null;
    }
  }

  if (errors.length > 0) {
    return Response.json({ success: false, message: errors[0] }, { status: 400 });
  }

 
  if (Object.keys($set).length === 1) {
    return Response.json({ success: false, message: "No fields to update." }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db     = client.db("gotravel");

    const updated = await db.collection("courses").findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      { $set },
      {
        returnDocument: "after",
        projection: { title: 1, status: 1, shortDescription: 1, price: 1, category: 1, thumbnail: 1, updatedAt: 1 },
      }
    );

    if (!updated) {
      return Response.json({ success: false, message: "Course not found." }, { status: 404 });
    }

    revalidateTag("courses");

    return Response.json({
      success: true,
      message: "Course updated successfully.",
      data: { ...updated, _id: updated._id.toString() },
    });
  } catch (err) {
    console.error("PATCH /api/admin/courses/[courseId] error:", err);
    return Response.json({ success: false, message: "Database error. Please try again." }, { status: 500 });
  }
}





// now it ends