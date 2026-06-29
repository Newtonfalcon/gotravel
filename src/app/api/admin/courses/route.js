import clientPromise from "@/lib/mongodb";








export async function POST(req) {
    const {title, description, price, category} = await req.json();

    try {
        if (!title || !description || !price ) {
            return Response.json({
                success: false,
                message: "Title, description, and price are required.",
            }, { status: 400
            })
        }

        const client = await clientPromise;
        const db = client.db("gotravel");
        const coursesCollection = db.collection("courses");

        const course = {
            title: title.trim(),
            shortDescription: description.trim(),

            thumbnail: null,

            category: null,

            price: parseFloat(price),

            lessonCount: 0,

            status: "draft",

            createdAt: new Date(),

            updatedAt: new Date(),

        };

        const result = await coursesCollection.insertOne(course);
        return Response.json({
            success: true,
            message: "Course created successfully.",
            data: { courseId: result.insertedId,
                ...course
             },
            
        }, { status: 201 });
    
        
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error creating course.",
            error: error.message,
        }, { status: 500 });

        
        
    }
}