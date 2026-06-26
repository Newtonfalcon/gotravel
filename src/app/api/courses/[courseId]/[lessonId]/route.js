import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    const { lessonId } = await params;  // await params in Next.js 15

    if (!lessonId || !ObjectId.isValid(lessonId)) {
        return Response.json({
            success: false,
            message: "Valid lesson ID is required.",
        }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("gotravel");
        const lesson = await db.collection("lessons").findOne(
            { _id: new ObjectId(lessonId) },
            { projection: { title: 1, description: 1, videoId: 1, isPreview: 1, courseId: 1, order: 1 } }
        );

        if (!lesson) {
            return Response.json({
                success: false,
                message: "Lesson not found.",
            }, { status: 404 });
        }

        return Response.json({ success: true, data: lesson });

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error fetching lesson.",
            error: error.message,
        }, { status: 500 });
    }
}