import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import nodemailer from 'nodemailer'

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
  try {
    const body = await req.json()
    const { items, deliveryPrice, shippingDetails } = body

    // Izračunavanje ukupne cene
    const amount = items.reduce((acc: number, item: any) => {
      return acc + (item.price * item.quantity)
    }, 0) + deliveryPrice

    // Kreiranje payment intent-a
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe očekuje cenu u centima
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: `order_${Date.now()}`,
        items: JSON.stringify(items.map((item: any) => ({
          id: item.id,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        }))),
        shipping: JSON.stringify(shippingDetails)
      }
    })

    // Slanje email notifikacije prodavcu
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'Nova Porudžbina - ST Racing Shop',
      html: `
        <h1>Nova porudžbina je primljena!</h1>
        <h2>Detalji porudžbine:</h2>
        <p><strong>Broj porudžbine:</strong> ${paymentIntent.metadata.orderId}</p>
        <p><strong>Ukupan iznos:</strong> ${amount.toFixed(2)} €</p>
        
        <h3>Kupac:</h3>
        <p>Ime: ${shippingDetails.name}</p>
        <p>Email: ${shippingDetails.email}</p>
        <p>Adresa: ${shippingDetails.address}</p>
        <p>Grad: ${shippingDetails.city}</p>
        <p>Poštanski broj: ${shippingDetails.postalCode}</p>
        <p>Država: ${shippingDetails.country}</p>
        
        <h3>Proizvodi:</h3>
        <ul>
          ${items.map((item: any) => `
            <li>
              ${item.name} - Veličina: ${item.size}
              <br>Količina: ${item.quantity}
              <br>Cena: ${item.price} €
            </li>
          `).join('')}
        </ul>
        
        <p><strong>Dostava:</strong> ${deliveryPrice} €</p>
      `
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error('Payment Intent Error:', error)
    return NextResponse.json(
      { error: 'Došlo je do greške prilikom procesiranja plaćanja.' },
      { status: 500 }
    )
  }
} 