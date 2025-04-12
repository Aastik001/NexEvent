import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import type { WebhookEvent } from '@clerk/clerk-sdk-node';
import { createUser } from '@/lib/actions/user.action'; // Your user creation function

import User from '@/lib/mongodb/database/models/user.model'; // Your Mongoose model
import {connectToDatabase} from '@/lib/mongodb/database/index'; // Your DB connection util

export async function POST(req: Request) {
  // 1. Get headers for Svix verification
  const svix_id = headers().get('svix-id');
  const svix_timestamp = headers().get('svix-timestamp');
  const svix_signature = headers().get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing headers' }, { status: 400 });
  }

  // 2. Read and parse body
  const payload = await req.text();
  const headersObject = {
    'svix-id': svix_id,
    'svix-timestamp': svix_timestamp,
    'svix-signature': svix_signature,
  };

  // 3. Verify webhook with your Clerk Webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, headersObject) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // 4. Handle user.created event
  const eventType = evt.type;
  
  if (eventType === 'user.created') {
    const { id, email_addresses, username, image_url } = evt.data;

    const email = email_addresses?.[0]?.email_address ?? '';

    try {
      await connectToDatabase();

      console.log("Webhook received - creating user:", {
        id,
        email,
        username: username ?? '',
        image_url,
      });

      const newUser = await createUser({
        clerkId: id,
        email,
        username: username ?? '',
        photo: image_url,
        firstName: evt.data.first_name ?? 'Unknown',
        lastName: evt.data.last_name ?? 'Unknown',
      });

      // 5. Sync MongoDB ID back to Clerk public metadata
      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id.toString(),
          },
        });
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Event type not handled' }, { status: 200 });
}
