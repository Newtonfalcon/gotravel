//import createBunnyVideo from "@/lib/helper/bunnycreate";
import {uploadBunnyVideo} from "@/lib/helper/bunnyupload";
import { createBunnyVideo } from "@/lib/helper/bunnycreate";
import clientPromise from "@/lib/mongodb";

export async function POST(request, { params }) {
    
    

    const { courseId } = await params;
    const formData = await request.formData();
    if (!formData.has('video') || !formData.has('videoId')) {
        return new Response('Missing video or videoId', { status: 400 });
    }

    try {
            const title = formData.get("title");
            const description = formData.get("description");
            const video = formData.get("video");
            const videoId = formData.get("videoId");

            const bunnyVideo = await createBunnyVideo(title);
            if (!bunnyVideo.guid) {
                throw new Error("Failed to create Bunny video.");
                }

            console.log("Bunny video created:", bunnyVideo);
            
            const uploadResult = await uploadBunnyVideo(bunnyVideo?.guid, video);

            const client = await clientPromise;
            const db = client.db("gotravel");
            const lessonsCollection = db.collection("lessons");

            const lesson = {
                title: title.trim(),
                description: description.trim(),
                courseId: courseId,
                videoId: bunnyVideo.guid,
                order: parseInt(formData.get("order")) || 0,
                isPreview: formData.get("isPreview") === "true",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await lessonsCollection.insertOne(lesson);
            return new Response(JSON.stringify({
                success: true,
                message: "Lesson created successfully.",
                data: { lessonId: result.insertedId, ...lesson },
            }), { status: 201 });







    } catch (error) {
        console.error("Error creating lesson:", error);
        return new Response('Error creating lesson', { status: 500 });
} 
}
