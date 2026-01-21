import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export async function POST(request) {
    // retrieve the items in the cart
    const data = await request.json();

    try {
        const headersList = await headers()
        const origin = headersList.get('origin');
        console.log(origin);

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options: [
                {shipping_rate: 'shr_1SqMyhAGqwayuqQ3HWmMRr19' },
                {shipping_rate: 'shr_1SqMzgAGqwayuqQ31N8VEjPd' },
            ],
            line_items: data.map((item) => {
                const img = item.image[0].asset._ref;
                const newImage = img.replace('image-', 'https://cdn.sanity.io/images/h56a3dx8/production/').replace('-webp', '.webp');
                console.log(origin);

                return {
                    price_data: {
                        currency: 'cad',
                        product_data: {
                            name: item.name,
                            images: [newImage],
                        },
                        unit_amount: item.price*100,
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1,
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            // success_url: `${origin}/?success=true`,
        };

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create(params);
        // return NextResponse.redirect(session.url, 303);
        return NextResponse.json(session);
    } catch (err) {
        return NextResponse.json(
        { error: err.message },
        { status: err.statusCode || 500 }
        )
    }
}