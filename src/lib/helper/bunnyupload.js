import { BUNNY_API_KEY, BUNNY_LIBRARY_ID } from "@/lib/bunny";

export async function uploadBunnyVideo(videoId, videoFile) {
  try {
    if (!videoId) {
      throw new Error("Missing Bunny video ID.");
    }

    if (!videoFile || typeof videoFile.arrayBuffer !== "function") {
      throw new Error("Missing video file payload.");
    }

    if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
      throw new Error("Bunny library ID or API key is missing from environment variables.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const arrayBuffer = await videoFile.arrayBuffer();

      const response = await fetch(
        `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${videoId}`,
        {
          method: "PUT",
          headers: {
            AccessKey: BUNNY_API_KEY,
            "Content-Type": "application/octet-stream",
          },
          body: Buffer.from(arrayBuffer),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error uploading video: ${errorText}`);
      }

      return { success: true, message: "Video uploaded successfully" };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("Bunny upload timed out. The file may be large or the connection may be slow.");
    }
    console.error("Error uploading video:", error);
    throw error;
  }
}