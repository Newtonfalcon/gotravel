import { BUNNY_API_KEY, BUNNY_LIBRARY_ID } from '@/lib/bunny'
export async function POST(request) {
    const {title} = await request.json()
    const response = await fetch(`https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'AccessKey': BUNNY_API_KEY,
        },
        body: JSON.stringify({
            title: title,
            isPublic: true,
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        return new Response(`Error creating video: ${errorText}`, { status: response.status })
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), { status: 200 })
}