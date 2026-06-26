import clientPromise from "@/lib/mongodb";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
    const skip = (page - 1) * limit;

    try {
        const client = await clientPromise;  // inside try
        const db = client.db("gotravel");
        const coursesCollection = db.collection("courses");

        const [courses, total] = await Promise.all([
            coursesCollection
                .find({ status: "published" })
                .project({ title: 1, shortDescription: 1, price: 1, thumbnail: 1, category: 1, lessonCount: 1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            coursesCollection.countDocuments({ status: "published" }),
        ]);

        return Response.json({
            success: true,
            data: courses,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error fetching courses.",
            error: error.message,
        }, { status: 500 });
    }
}