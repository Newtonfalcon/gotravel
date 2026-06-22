/*
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import clientPromise from '@/lib/mongodb'

export const runtime = 'nodejs'

function buildUserRecord(data) {
    const firstName = data.first_name?.trim() ?? ''
    const lastName = data.last_name?.trim() ?? ''

    return {
        clerkId: data.id,
        email: data.email_addresses?.[0]?.email_address ?? '',
        name: [firstName, lastName].filter(Boolean).join(' '),
        image: data.image_url ?? '',
    }
}

export async function POST(request) {
    const payload = await request.text()
    const headerPayload = await headers()

    const svixId = headerPayload.get('svix-id')
    const svixTimestamp = headerPayload.get('svix-timestamp')
    const svixSignature = headerPayload.get('svix-signature')
    const webhookSecret = process.env.SVIX_SECRET

    if (!webhookSecret) {
        return new Response('Webhook secret is not configured', { status: 500 })
    }

    if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response('Missing Svix headers', { status: 400 })
    }

    const wh = new Webhook(webhookSecret)

    let evt

    try {
        evt = wh.verify(payload, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
        })
    } catch (err) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    const { type, data } = evt
    const db = (await clientPromise).db('gotravel')
    const users = db.collection('users')

    switch (type) {
        case 'user.created':
            await users.updateOne(
                { clerkId: data.id },
                {
                    $setOnInsert: {
                        ...buildUserRecord(data),
                        createdAt: new Date(),
                    },
                    $set: {
                        updatedAt: new Date(),
                    },
                },
                { upsert: true }
            )
            break
        case 'user.updated':
            await users.updateOne(
                { clerkId: data.id },
                {
                    $set: {
                        ...buildUserRecord(data),
                        updatedAt: new Date(),
                    },
                    $setOnInsert: {
                        createdAt: new Date(),
                    },
                },
                { upsert: true }
            )
            break
        case 'user.deleted':
            await users.deleteOne({ clerkId: data.id })
            break
        default:
            break
    }

    return new Response('Success', { status: 200 })

*/


import { Webhook } from 'svix'
import { headers } from 'next/headers'
import clientPromise from '@/lib/mongodb'

export const runtime = 'nodejs'

function buildUserRecord(data) {
  const firstName = data.first_name?.trim() ?? ''
  const lastName = data.last_name?.trim() ?? ''

  return {
    clerkId: data.id,
    email: data.email_addresses?.[0]?.email_address ?? '',
    name:
      [firstName, lastName].filter(Boolean).join(' ') ||
      data.username ||
      'User',
    image: data.image_url ?? '',
  }
}

export async function POST(request) {
  const payload = await request.text()
  const headerPayload = await headers()

  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  const webhookSecret = process.env.SVIX_SECRET

  if (!webhookSecret) {
    return new Response('Webhook secret is not configured', {
      status: 500,
    })
  }

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing Svix headers', {
      status: 400,
    })
  }

  const wh = new Webhook(webhookSecret)

  let evt

  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch (err) {
    console.error('Webhook verification failed:', err)

    return new Response(
      `Webhook Error: ${err.message}`,
      { status: 400 }
    )
  }

  const { type, data } = evt

  try {
    const client = await clientPromise
    const db = client.db('gotravel')
    const users = db.collection('users')

    switch (type) {
      case 'user.created':
      case 'user.updated':
        await users.updateOne(
          { clerkId: data.id },
          {
            $set: {
              ...buildUserRecord(data),
              updatedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
              role: 'user',
            },
          },
          { upsert: true }
        )
        console.log(`Processed ${type} event for user ID: ${data.id}`)
        break

      case 'user.deleted':
        await users.deleteOne({
          clerkId: data.id,
        })
        break

      default:
        console.log(`Unhandled webhook event: ${type}`)
        break
    }

    return new Response('Success', {
      status: 200,
    })
  } catch (error) {
    console.error('Database error:', error)

    return new Response('Database error', {
      status: 500,
    })
  }
}