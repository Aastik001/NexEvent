import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

export async function createCheckoutSession(eventId: string, quantity: number, userId: string) {
  try {
    // Fetch event details from Supabase
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error || !event) {
      throw new Error('Event not found');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: event.title,
              description: `Ticket for ${event.title}`,
              images: event.image_url ? [event.image_url] : [],
            },
            unit_amount: Math.round(event.price * 100), // Convert to cents
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${window.location.origin}/event/${eventId}?success=true`,
      cancel_url: `${window.location.origin}/event/${eventId}?canceled=true`,
      metadata: {
        eventId,
        userId,
        quantity,
      },
    });

    return { id: session.id };
  } catch (error: any) {
    console.error('Checkout session error:', error);
    throw new Error(error.message);
  }
}