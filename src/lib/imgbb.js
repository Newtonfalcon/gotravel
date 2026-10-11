// src/lib/imgbb.js
import "server-only";

/**
 * imgbb image hosting (server only). Requires IMGBB_API_KEY.
 * Docs: https://api.imgbb.com/
 */

const ENDPOINT = "https://api.imgbb.com/1/upload";
const TIMEOUT_MS = 30_000;

export const IMAGE_RULES = {
  maxBytes: 4 * 1024 * 1024, // stays under the 4.5 MB request-body limit on serverless hosts
  types: ["image/jpeg", "image/png", "image/webp", "image/gif"],
};

export class ImgbbError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.name = "ImgbbError";
    this.status = status;
  }
}

export function validateImage(file) {
  if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
    throw new ImgbbError("Choose an image to upload.", 400);
  }
  if (!IMAGE_RULES.types.includes(file.type)) {
    throw new ImgbbError("Use a JPG, PNG, WebP or GIF image.", 415);
  }
  if (file.size > IMAGE_RULES.maxBytes) {
    throw new ImgbbError("Images must be 4 MB or smaller.", 413);
  }
}

export async function uploadToImgbb(file) {
  const key = process.env.IMGBB_API_KEY;
  if (!key) throw new ImgbbError("Image uploads are not configured.", 503);

  const payload = new FormData();
  payload.append("image", file, file.name || "upload");

  let response;
  try {
    response = await fetch(`${ENDPOINT}?key=${encodeURIComponent(key)}`, {
      method: "POST",
      body: payload,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    console.error("[imgbb] request failed:", error?.message);
    throw new ImgbbError("The image host did not respond. Please try again.", 504);
  }

  let json = null;
  try {
    json = await response.json();
  } catch {
    // fall through to the generic error below
  }

  const data = json?.data;
  if (!response.ok || !json?.success || !(data?.url || data?.display_url)) {
    console.error("[imgbb] upload rejected:", response.status, json?.error?.message);
    throw new ImgbbError("The image host rejected the upload. Please try again.", 502);
  }

  return {
    url: data.url || data.display_url,
    thumbUrl: data.thumb?.url || null,
    width: Number(data.width) || null,
    height: Number(data.height) || null,
  };
}