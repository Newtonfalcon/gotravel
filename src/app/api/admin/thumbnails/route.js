import { requireAdmin } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

async function toBase64FromBlob(blob) {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return buffer.toString("base64");
}

export async function GET(req) {
  try {
    const user = await requireAdmin(); // will redirect if not admin
    const client = await clientPromise;
    const db = client.db("gotravel");
    const docs = await db
      .collection("thumbnails")
      .find({}, { projection: { url: 1, display_url: 1, thumb: 1, imgbbId: 1, delete_url: 1, name: 1, createdAt: 1, uploader: 1 } })
      .sort({ createdAt: -1 })
      .toArray();

    return new Response(JSON.stringify({ success: true, thumbnails: docs }), { status: 200 });
  } catch (err) {
    console.error("Thumbnails GET error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await requireAdmin();
    const form = await req.formData();

    const imageFile = form.get("image");
    const imageUrl = form.get("imageUrl");
    const name = form.get("name") || "gotravel-thumbnail";

    if (!imageFile && !imageUrl) {
      return new Response(JSON.stringify({ success: false, error: "image or imageUrl is required" }), { status: 400 });
    }

    const imgbbKey = process.env.IMGBB_API_KEY;
    if (!imgbbKey) {
      return new Response(JSON.stringify({ success: false, error: "IMGBB_API_KEY not configured" }), { status: 500 });
    }

    let base64;
    if (imageFile && imageFile.size) {
      base64 = await toBase64FromBlob(imageFile);
    } else if (imageUrl) {
      // fetch the remote image and convert
      const fetched = await fetch(String(imageUrl));
      if (!fetched.ok) throw new Error("Failed to fetch remote image");
      const blob = await fetched.blob();
      base64 = await toBase64FromBlob(blob);
    }

    const payload = new URLSearchParams();
    payload.append("key", imgbbKey);
    payload.append("image", base64);
    payload.append("name", String(name));

    const resp = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: payload,
    });

    const text = await resp.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: "Invalid imgbb response", detail: text }), { status: 502 });
    }

    if (!data || !data.success) {
      return new Response(JSON.stringify({ success: false, error: data?.error || "imgbb upload failed", detail: data }), { status: 502 });
    }

    const imageData = data.data || {};
    const doc = {
      url: imageData.url,
      display_url: imageData.display_url,
      thumb: imageData.thumb?.url || null,
      imgbbId: imageData.id,
      delete_url: imageData.delete_url || null,
      name: String(name || imageData.title || imageData.id || "gotravel-thumbnail"),
      uploader: { clerkId: user.clerkId, name: user.name || null, email: user.email || null },
      createdAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db("gotravel");
    await db.collection("thumbnails").insertOne(doc);

    return new Response(JSON.stringify({ success: true, thumbnail: doc }), { status: 200 });
  } catch (err) {
    console.error("Thumbnails POST error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const user = await requireAdmin();
    const body = await req.json();
    const { imgbbId, _id } = body;

    if (!imgbbId && !_id) {
      return new Response(JSON.stringify({ success: false, error: "imgbbId or _id required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("gotravel");

    // find doc
    const query = _id ? { _id: new (require("mongodb").ObjectId)(_id) } : { imgbbId };
    const doc = await db.collection("thumbnails").findOne(query);
    if (!doc) {
      return new Response(JSON.stringify({ success: false, error: "not found" }), { status: 404 });
    }

    // attempt to delete from imgbb if delete_url present
    if (doc.delete_url) {
      try {
        await fetch(doc.delete_url, { method: "GET" });
      } catch (e) {
        // ignore external delete errors
        console.warn("imgbb delete failed", e.message);
      }
    }

    await db.collection("thumbnails").deleteOne(query);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Thumbnails DELETE error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
