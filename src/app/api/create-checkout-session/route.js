import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { isValidDeliveryPostcode } from '../../config/deliveryAreas';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { items, shippingAddress } = await request.json();
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // If shipping address is provided, validate it
    if (shippingAddress?.postal_code) {
      if (!isValidDeliveryPostcode(shippingAddress.postal_code)) {
        return NextResponse.json(
          { error: 'Sorry, we do not deliver to this postcode. Please check our delivery areas.' },
          { status: 400 }
        );
      }
    }

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: items.map(item => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: 1,
      })),
      mode: 'payment',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'gbp',
            },
            display_name: 'Free delivery',
          },
        },
      ],
      return_url: `${origin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 