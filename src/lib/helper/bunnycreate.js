/*import { BUNNY_API_KEY, BUNNY_LIBRARY_ID } from "@/lib/bunny";

export async function createBunnyVideo(title) {
  try {
     const response = await fetch(`https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'AccessKey': BUNNY_API_KEY,
        },
        body: JSON.stringify({
            title: title,
            isPublic: true,
        }),
    })

    if (!response.ok) {
      
      throw new Error(data.Message || "Failed to create Bunny video");
    }
    console.log("Bunny video created successfully:", response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating video:", error);
    throw error;
  }
}
*/


import { BUNNY_API_KEY, BUNNY_LIBRARY_ID } from "@/lib/bunny";

export async function createBunnyVideo(title) {
  if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
    throw new Error("Bunny library ID or API key is missing from environment variables.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          AccessKey: BUNNY_API_KEY,
        },
        body: JSON.stringify({ title, isPublic: true }),
        signal: controller.signal,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.Message || `Bunny error ${response.status}`);
    }

    return data; // { guid, ... }
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("Bunny request timed out while creating the video slot.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
