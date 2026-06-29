import clientPromise from "@/lib/mongodb";


export async function GET(request, { params }) {

    const {courseId} = await params;

    try {
        const client = await clientPromise;
        const db = client.db("gotravel");
        const lessonsCollection = db.collection("lessons");
        
        const lessons = await lessonsCollection
            .find({ courseId: courseId })
            .project({ title: 1, description: 1, videoId: 1, order: 1, isPreview: 1 })
            .sort({ order: 1 })
            .toArray();

        return Response.json({
            success: true,
            data: lessons,
        });

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error fetching lessons.",
            error: error.message,
        }, { status: 500 });
    }

}