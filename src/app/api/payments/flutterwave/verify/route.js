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


    } catch (error) {
        
    }
    
}