// src/lib/blog/http.js
import "server-only";
import { NextResponse } from "next/server";
import { FirebaseNotConfiguredError } from "@/lib/firebaseAdmin";
import { BlogError } from "./store";
import { ImgbbError } from "@/lib/imgbb";

export function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip")) || "unknown";
}

/** Returns the parsed JSON body, or null when it is missing or malformed. */
export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function badRequest(message) {
  return NextResponse.json({ message }, { status: 400 });
}

export function tooManyRequests(retryAfter) {
  return NextResponse.json(
    { message: "You're doing that too quickly. Please wait a moment." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

/** Maps known errors to clean responses; unknown errors are logged, never leaked. */
export function errorResponse(error, scope = "blog") {
  if (error instanceof BlogError || error instanceof ImgbbError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }
  if (error instanceof FirebaseNotConfiguredError) {
    console.error(`[${scope}] ${error.message}`);
    return NextResponse.json({ message: "The blog is temporarily unavailable." }, { status: 503 });
  }
  console.error(`[${scope}]`, error);
  return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
}