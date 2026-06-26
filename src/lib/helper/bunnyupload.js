import {BUNNY_API_KEY,BUNNY_LIBRARY_ID} from "@/lib/bunny";

export async function uploadBunnyVideo(videoId, videoFile) {

    try{

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
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error uploading video: ${errorText}`);
    }

    return { success: true, message: "Video uploaded successfully" };
} catch (error) {
    console.error("Error uploading video:", error);
    throw error;   
}
}