// src/lib/blog/imageUpload.js
/**
 * Client-side image preparation + upload for the blog editor.
 * Large photos are downscaled in the browser so uploads stay well under the
 * 4 MB server limit (and under the request-body limit on serverless hosts).
 */

const MAX_EDGE = 1920;
const MAX_BYTES = 3.5 * 1024 * 1024;
const SKIP_BELOW = 800 * 1024;

function loadBitmap(file) {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file).catch(() => loadWithImageElement(file));
  }
  return loadWithImageElement(file);
}

function loadWithImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file could not be read as an image."));
    };
    image.src = url;
  });
}

function toBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function renameFor(file, blob) {
  const base = (file.name || "image").replace(/\.[^.]+$/, "");
  const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[blob.type] || "jpg";
  return new File([blob], `${base}.${extension}`, { type: blob.type });
}

export async function prepareImage(file) {
  // Animated GIFs cannot be re-encoded on a canvas without losing animation.
  if (file.type === "image/gif") {
    if (file.size > MAX_BYTES) throw new Error("GIFs must be smaller than 3.5 MB.");
    return file;
  }

  const bitmap = await loadBitmap(file);
  const sourceWidth = bitmap.width;
  const sourceHeight = bitmap.height;

  if (file.size <= SKIP_BELOW && Math.max(sourceWidth, sourceHeight) <= MAX_EDGE) return file;

  const keepsAlpha = file.type === "image/png" || file.type === "image/webp";
  let scale = Math.min(1, MAX_EDGE / Math.max(sourceWidth, sourceHeight));

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    const context = canvas.getContext("2d");

    let blob;
    if (keepsAlpha) {
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      blob = await toBlob(canvas, "image/webp", 0.86);
      if (!blob || blob.type !== "image/webp") blob = await toBlob(canvas, "image/png");
    } else {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      blob = await toBlob(canvas, "image/jpeg", 0.86);
    }

    if (blob && blob.size <= MAX_BYTES) {
      // Never make a small file bigger than the original.
      return blob.size < file.size || scale < 1 ? renameFor(file, blob) : file;
    }
    scale *= 0.75;
  }

  throw new Error("That image is too large to upload. Try a smaller one.");
}

/** Uploads through the admin-only endpoint and resolves with the hosted image URL. */
export async function uploadBlogImage(file) {
  const prepared = await prepareImage(file);
  const form = new FormData();
  form.append("image", prepared);

  const response = await fetch("/api/admin/blogs/upload-image", { method: "POST", body: form });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) throw new Error("Your session expired. Sign in again to upload.");
    if (response.status === 413) throw new Error("That image is too large to upload.");
    throw new Error(data.message || "Image upload failed.");
  }
  return data.url;
}
