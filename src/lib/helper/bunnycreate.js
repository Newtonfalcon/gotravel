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
  const response = await fetch(
    `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AccessKey: BUNNY_API_KEY,
      },
      body: JSON.stringify({ title, isPublic: true }),
    }
  );

  // Parse body first — then check status so error messages are available
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.Message || `Bunny error ${response.status}`);
  }

  return data; // { guid, ... }
}
