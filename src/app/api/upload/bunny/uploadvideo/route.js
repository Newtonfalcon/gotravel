import { BUNNY_API_KEY, BUNNY_LIBRARY_ID } from "@/lib/bunny";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const video = formData.get("video");
    const videoId = formData.get("videoId");

    if (!video || !videoId) {
      return Response.json(
        {
          success: false,
          message: "Video and videoId are required.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await video.arrayBuffer();

    const bunnyResponse = await fetch(
      `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos/${videoId}`,
      {
        method: "PUT",
        headers: {
          AccessKey: process.env.BUNNY_API_KEY,
          "Content-Type": "application/octet-stream",
        },
        body: Buffer.from(arrayBuffer),
      }
    );

    if (!bunnyResponse.ok) {
      const error = await bunnyResponse.text();

      return Response.json(
        {
          success: false,
          error,
        },
        { status: bunnyResponse.status }
      );
    }

    return Response.json({
      success: true,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}