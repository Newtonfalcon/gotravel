import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("gotravel");

    // test collection
    const collection = db.collection("test_users");

    // insert test data
    await collection.insertOne({
      name: "Test User",
      createdAt: new Date(),
    });

    // read data back
    const users = await collection.find({}).toArray();

    return Response.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}