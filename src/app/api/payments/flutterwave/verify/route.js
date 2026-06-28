/*
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import flutterwave from "@/lib/helper/flutterwave";
import {ObjectId} from "mongodb"

export const runtime = "nodejs"

export async function POST(req) {

    try {
        const transactionId = await req.json()

        if(!transactionId){
            return NextResponse.json({
                error: "No transaction Id"
            }, {status:400})
        }

        const response = await flutterwave.get(
            `/transactions/${transactionId}/verify`

        )

        const payment = response.data.data

        if(payment.status !== "successful"){
            return NextResponse.json(
            { error: "Payment not successful" },
            { status: 400 });

        
        }

        const { clerkId, courseId } = payment.meta;

        const client = await clientPromise;

        const db = client.db("gotravel");

        const course = await db.collection("courses").findOne({
            _id: new ObjectId(courseId)
        });

        if (payment.amount !== course.price) {

            return NextResponse.json(
                {
                    error: "Payment amount mismatch"
                },
                {
                    status: 400
                }
            );

        }


        const user = await db.collection("users").findOne({
            clerkId
        });

        await db.collection("users").updateOne(
            {
                clerkId
            },
            {
                $addToSet: {
                    courses: course._id
                }
            }
        );


        return NextResponse.json({
            success: true
        });


    } catch (error) {
        return NextResponse.json({

        })
        
    }
    
}

*/


import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import flutterwave from "@/lib/helper/flutterwave";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const transaction_id = body?.transaction_id;

    if (!transaction_id) {
      return NextResponse.json(
        { error: "No transaction ID provided" },
        { status: 400 }
      );
    }

    // ── 1. Confirm the transaction with Flutterwave ─────────────────────
    const fwRes = await flutterwave.get(
      `/transactions/${transaction_id}/verify`
    );

    const payment = fwRes.data?.data;

    if (!payment) {
      return NextResponse.json(
        { error: "Invalid response from payment provider" },
        { status: 502 }
      );
    }

    if (payment.status !== "successful") {
      return NextResponse.json(
        { error: `Payment status is "${payment.status}", not successful` },
        { status: 400 }
      );
    }

    // ── 2. Extract metadata set during payment creation ─────────────────
    const { clerkId, courseId } = payment.meta ?? {};

    if (!clerkId || !courseId) {
      return NextResponse.json(
        { error: "Payment metadata is missing clerkId or courseId" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { error: "Invalid courseId in payment metadata" },
        { status: 400 }
      );
    }

    // ── 3. Fetch the course and verify the amount paid ───────────────────
    const client = await clientPromise;
    const db = client.db("gotravel");

    const course = await db.collection("courses").findOne({
      _id: new ObjectId(courseId),
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    if (payment.amount < course.price) {
      return NextResponse.json(
        { error: "Payment amount does not match course price" },
        { status: 400 }
      );
    }

    // ── 4. Check user exists ─────────────────────────────────────────────
    const user = await db.collection("users").findOne({ clerkId });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ── 5. Grant access (idempotent — $addToSet won't duplicate) ────────
    await db.collection("users").updateOne(
      { clerkId },
      { $addToSet: { courses: course._id } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      {
        error:
          error?.response?.data?.message ??
          error?.message ??
          "An unexpected error occurred during verification",
      },
      { status: 500 }
    );
  }
}