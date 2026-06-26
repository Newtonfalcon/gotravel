export async function POST(request) {
    const formData = await request.formData()
    if (!formData.has('video') || !formData.has('videoId')) {
        return new Response('Missing video or videoId', { status: 400 })
    }

    try {
            const title = formData.get("title");
            const description = formData.get("description");
            const courseId = formData.get("courseId");
            const order = formData.get("order");
            const isPreview = formData.get("isPreview") === "true";
            const video = formData.get("video");

            
            


    } catch (error) {
        return new Response('Error creating lesson', { status: 500 })
    }
}