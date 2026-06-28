import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import flutterwave from "@/lib/helper/flutterwave";
import { generateTxRef } from "@/lib/generateTxRef";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }

        const { courseId } = await request.json();
        console.log(`the course id ${courseId}`);

        if (!courseId) {
            return NextResponse.json({ error: "course ID is required!" }, { status: 400 });
        }

        // 💡 BUG FIX: Prevent ObjectId crash if courseId is malformed
        if (!ObjectId.isValid(courseId)) {
            return NextResponse.json({ error: "Invalid course ID format" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = await client.db("gotravel");

        const course = await db.collection("courses").findOne({
            _id: new ObjectId(courseId)
        });
        
        console.log(`course details ${course?.price}`);
        
        
        if (!course) {
            
            
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const user = await db.collection("users").findOne({
            clerkId: userId
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        console.log(`got a user of ${user.name}, ${user.email}`)

        const alreadyPurchased = user.courses?.some((id) => id.toString() === courseId);
        if (alreadyPurchased) {
            return NextResponse.json({ error: "You already own this course." }, { status: 400 });
        }

        const txRef = generateTxRef(userId);

        // Call Flutterwave API
        const response = await flutterwave.post("/payments", {
            tx_ref: txRef,
            amount: course.price,
            currency: "NGN",
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
            customer: {
                email: user.email,
                name: user.name || `goTravel-user ${user.email}`,
            },
            customizations: {
                title: "Gotravel",
                description: course.title,
                logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
            }, 
            meta: {
                clerkId: userId,
                courseId
            }
        });

        console.log(`payment response   ${response?.data?.data?.link}`);
        

        // 💡 BUG FIX: Ensure Flutterwave responded with a valid payment link safely
        const paymentLink = response?.data?.data?.link;
        if (!paymentLink) {
            console.error("Flutterwave error response:", response?.data);
            return NextResponse.json({ error: "Failed to generate payment link from provider" }, { status: 502 });
        }

        return NextResponse.json({
            PaymentAddressLink: paymentLink
        });

    } catch (error) {
        console.error("Payment Route Error:", error);

        return NextResponse.json({
            message: error.message || "An unexpected error occurred",
            success: false
        }, { status: 500 });
    }
}