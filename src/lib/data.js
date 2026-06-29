import { unstable_cache } from "next/cache";
import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

// ── Admin: all courses (any status) ─────────────────────────────────────────
export const getAdminCourses = unstable_cache(
  async () => {
    const client = await clientPromise;
    const db = client.db("gotravel");
    const courses = await db
      .collection("courses")
      .find({})
      .project({
        title: 1, shortDescription: 1, price: 1, thumbnail: 1,
        category: 1, lessonCount: 1, status: 1, createdAt: 1, updatedAt: 1,
      })
      .sort({ createdAt: -1 })
      .toArray();
    return courses.map((c) => ({ ...c, _id: c._id.toString() }));
  },
  ["admin-courses-list"],
  { revalidate: 30, tags: ["courses"] }
);

// ── Admin: single course + its lessons ──────────────────────────────────────
export const getAdminCourseWithLessons = unstable_cache(
  async (courseId) => {
    if (!courseId || !ObjectId.isValid(courseId)) return null;
    const client = await clientPromise;
    const db = client.db("gotravel");

    const [course, lessons] = await Promise.all([
      db.collection("courses").findOne(
        { _id: new ObjectId(courseId) },
        {
          projection: {
            title: 1, shortDescription: 1, price: 1, thumbnail: 1,
            category: 1, lessonCount: 1, status: 1, createdAt: 1, updatedAt: 1,
          },
        }
      ),
      db.collection("lessons")
        .find({ courseId })
        .project({ title: 1, description: 1, videoId: 1, order: 1, isPreview: 1, createdAt: 1 })
        .sort({ order: 1 })
        .toArray(),
    ]);

    if (!course) return null;

    return {
      course: { ...course, _id: course._id.toString() },
      lessons: lessons.map((l) => ({ ...l, _id: l._id.toString() })),
    };
  },
  ["admin-course-with-lessons"],
  { revalidate: 30, tags: ["courses", "lessons"] }
);

export const getCourses = unstable_cache(
  async (page = 1, limit = 12, search = "") => {
    const client = await clientPromise;
    const db = client.db("gotravel");
    const col = db.collection("courses");
    const skip = (page - 1) * limit;

    const filter = { status: "published" };
    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
        { shortDescription: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const [courses, total] = await Promise.all([
      col
        .find(filter)
        .project({ title: 1, shortDescription: 1, price: 1, thumbnail: 1, category: 1, lessonCount: 1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      col.countDocuments(filter),
    ]);

    return {
      courses: courses.map((c) => ({ ...c, _id: c._id.toString() })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },
  ["courses-list"],
  { revalidate: 60, tags: ["courses"] }
);

export const getCourse = unstable_cache(
  async (courseId) => {
    if (!courseId || !ObjectId.isValid(courseId)) return null;
    const client = await clientPromise;
    const db = client.db("gotravel");
    const course = await db.collection("courses").findOne(
      { _id: new ObjectId(courseId), status: "published" },
      { projection: { title: 1, shortDescription: 1, price: 1, thumbnail: 1, category: 1, lessonCount: 1 } }
    );
    return course ? { ...course, _id: course._id.toString() } : null;
  },
  ["course-detail"],
  { revalidate: 60, tags: ["courses"] }
);

export const getLessons = unstable_cache(
  async (courseId) => {
    const client = await clientPromise;
    const db = client.db("gotravel");
    const lessons = await db
      .collection("lessons")
      .find({ courseId })
      .project({ title: 1, description: 1, videoId: 1, order: 1, isPreview: 1 })
      .sort({ order: 1 })
      .toArray();
    return lessons.map((l) => ({ ...l, _id: l._id.toString() }));
  },
  ["lessons-list"],
  { revalidate: 60, tags: ["lessons"] }
);




// Admin: dashboard stats (single trip, two parallel counts) ──────────────
export const getAdminStats = unstable_cache(
  async () => {
    const client = await clientPromise;
    const db = client.db("gotravel");

    const [courseAgg, lessonCount, userCount] = await Promise.all([
      db.collection("courses").aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]).toArray(),
      db.collection("lessons").countDocuments(),
      db.collection("users").countDocuments(),
    ]);

    const published = courseAgg.find((s) => s._id === "published")?.count ?? 0;
    const draft     = courseAgg.find((s) => s._id === "draft")?.count ?? 0;

    return { total: published + draft, published, draft, lessonCount, userCount };
  },
  ["admin-stats"],
  { revalidate: 30, tags: ["courses", "lessons"] }
);
