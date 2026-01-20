import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    console.log(request);

    try {
        const headersList = await headers()
        const origin = headersList.get('origin');

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options: [
                {shipping_rate: 'shr_1SqMyhAGqwayuqQ3HWmMRr19' },
                {shipping_rate: 'shr_1SqMzgAGqwayuqQ31N8VEjPdy' },
            ],
            line_items: [
                {
                // Provide the exact Price ID (for example, price_1234) of the product you want to sell
                price: '{{PRICE_ID}}',
                quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        };

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create(params);
        return NextResponse.redirect(session.url, 303)
    } catch (err) {
        return NextResponse.json(
        { error: err.message },
        { status: err.statusCode || 500 }
        )
    }
}