import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe key is not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()
    const { orderDetails, customerDetails, confirmPayment, paymentIntentId } = body

    if (confirmPayment && paymentIntentId) {
      // Update order status and save to database if needed
      return NextResponse.json({ success: true })
    }

    // Create a new payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderDetails.totalAmount * 100), // Convert to cents
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: `order_${Date.now()}`,
        items: JSON.stringify(orderDetails.items),
        shipping: JSON.stringify(customerDetails)
      }
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error('Order Error:', error)
    return NextResponse.json(
      { error: 'Došlo je do greške prilikom procesiranja narudžbe.' },
      { status: 500 }
    )
  }
} 