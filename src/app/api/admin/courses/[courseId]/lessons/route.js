//import createBunnyVideo from "@/lib/helper/bunnycreate";
/*import {uploadBunnyVideo} from "@/lib/helper/bunnyupload";
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
*/


import { revalidateTag } from "next/cache";
import { ObjectId } from "mongodb";
import { createBunnyVideo } from "@/lib/helper/bunnycreate";
import { uploadBunnyVideo } from "@/lib/helper/bunnyupload";
import clientPromise from "@/lib/mongodb";

export async function POST(request, { params }) {
  const { courseId } = await params;

  if (!courseId || !ObjectId.isValid(courseId)) {
    return Response.json({ success: false, message: "Invalid course ID." }, { status: 400 });
  }

  const formData = await request.formData();

  const title       = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const video       = formData.get("video");
  const order       = parseInt(formData.get("order") ?? "0", 10);
  const isPreview   = formData.get("isPreview") === "true";

  if (!title || !description || !video) {
    return Response.json(
      { success: false, message: "Title, description, and video are required." },
      { status: 400 }
    );
  }

  try {
    // 1. Create a Bunny video slot
    const bunnyVideo = await createBunnyVideo(title);
    if (!bunnyVideo?.guid) {
      throw new Error("Bunny did not return a video GUID.");
    }

    // 2. Upload the binary to Bunny
    await uploadBunnyVideo(bunnyVideo.guid, video);

    // 3. Persist the lesson + bump lessonCount atomically
    const client = await clientPromise;
    const db = client.db("gotravel");

    const lesson = {
      courseId,
      title,
      description,
      videoId: bunnyVideo.guid,
      order: isNaN(order) ? 0 : order,
      isPreview,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [lessonResult] = await Promise.all([
      db.collection("lessons").insertOne(lesson),
      db.collection("courses").updateOne(
        { _id: new ObjectId(courseId) },
        { $inc: { lessonCount: 1 }, $set: { updatedAt: new Date() } }
      ),
    ]);

    // 4. Bust the relevant caches so the admin page reflects new data immediately
    revalidateTag("lessons");
    revalidateTag("courses");

    return Response.json(
      {
        success: true,
        message: "Lesson created successfully.",
        data: { lessonId: lessonResult.insertedId.toString(), ...lesson },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lesson:", error);
    return Response.json(
      { success: false, message: error.message || "Error creating lesson." },
      { status: 500 }
    );
  }
}
