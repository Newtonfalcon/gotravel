import { BUNNY_API_KEY, BUNNY_LIBRARY_ID } from "@/lib/bunny";
export async function createBunnyVideo(title) {
    try {
    const response = await fetch(`https://video.bunny.net/api/libraries/${BUNNY_LIBRARY_ID}/videos`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${BUNNY_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title
        })
    });


    const data = await response.json();
    return data;
    } catch (error) {
        console.error("Error creating video:", error);
        throw error;
    }
}