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
  try {
    const body = await req.json()
    const { orderDetails, customerDetails, confirmPayment, paymentIntentId } = body

    // If confirming payment, handle the confirmation flow
    if (confirmPayment && paymentIntentId) {
      // Retrieve the payment intent to get its current status
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      if (paymentIntent.status === 'succeeded') {
        // Send email notifications
        // Slanje email notifikacije prodavcu
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: process.env.ADMIN_EMAIL,
          subject: `Nova Porudžbina - ${paymentIntent.metadata.orderId}`,
          html: `
            <h1>Nova porudžbina je primljena!</h1>
            <h2>Detalji porudžbine:</h2>
            <p><strong>Broj porudžbine:</strong> ${paymentIntent.metadata.orderId}</p>
            <p><strong>Ukupan iznos:</strong> ${orderDetails.totalAmount.toFixed(2)} €</p>
            
            <h3>Kupac:</h3>
            <p>Ime: ${customerDetails.name}</p>
            <p>Email: ${customerDetails.email}</p>
            <p>Adresa: ${customerDetails.address}</p>
            <p>Grad: ${customerDetails.city}</p>
            <p>Poštanski broj: ${customerDetails.postalCode}</p>
            <p>Država: ${customerDetails.country}</p>
            <p>Način dostave: ${customerDetails.deliveryMethod}</p>
            
            <h3>Proizvodi:</h3>
            <ul>
              ${orderDetails.items.map((item: any) => `
                <li>
                  ${item.name} - Veličina: ${item.size}
                  <br>Količina: ${item.quantity}
                  <br>Cena: ${item.price} €
                </li>
              `).join('')}
            </ul>
            
            <p><strong>Međuzbir:</strong> ${orderDetails.totalPrice.toFixed(2)} €</p>
            <p><strong>Dostava:</strong> ${orderDetails.deliveryPrice.toFixed(2)} €</p>
            <p><strong>Ukupno:</strong> ${orderDetails.totalAmount.toFixed(2)} €</p>
          `
        })

        // Slanje email potvrde kupcu
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: customerDetails.email,
          subject: `Potvrda porudžbine - ${paymentIntent.metadata.orderId}`,
          html: `
            <h1>Hvala na kupovini!</h1>
            <p>Vaša porudžbina je uspešno primljena.</p>
            
            <h2>Detalji porudžbine:</h2>
            <p><strong>Broj porudžbine:</strong> ${paymentIntent.metadata.orderId}</p>
            
            <h3>Proizvodi:</h3>
            <ul>
              ${orderDetails.items.map((item: any) => `
                <li>
                  ${item.name} - Veličina: ${item.size}
                  <br>Količina: ${item.quantity}
                  <br>Cena: ${item.price} €
                </li>
              `).join('')}
            </ul>
            
            <p><strong>Međuzbir:</strong> ${orderDetails.totalPrice.toFixed(2)} €</p>
            <p><strong>Dostava:</strong> ${orderDetails.deliveryPrice.toFixed(2)} €</p>
            <p><strong>Ukupno:</strong> ${orderDetails.totalAmount.toFixed(2)} €</p>
            
            <h3>Adresa za dostavu:</h3>
            <p>${customerDetails.name}</p>
            <p>${customerDetails.address}</p>
            <p>${customerDetails.postalCode} ${customerDetails.city}</p>
            <p>${customerDetails.country}</p>
            
            <p>Način dostave: ${customerDetails.deliveryMethod}</p>
            <p>Očekivano vreme dostave: ${
              customerDetails.deliveryMethod === 'hp' ? '2-3 radna dana' :
              customerDetails.deliveryMethod === 'tisak' ? '1-2 radna dana' :
              '3-4 radna dana'
            }</p>
          `
        })

        return NextResponse.json({ 
          success: true, 
          orderId: paymentIntent.metadata.orderId,
          message: 'Porudžbina je uspešno procesirana' 
        })
      }
    }

    // If not confirming, create a new payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderDetails.totalAmount * 100), // Convert to cents
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        orderId: `ORDER-${Date.now()}`,
        customerEmail: customerDetails.email
      },
    })

    return NextResponse.json({ 
      success: true, 
      clientSecret: paymentIntent.client_secret,
      orderId: paymentIntent.metadata.orderId
    })

  } catch (error: any) {
    console.error('Order Processing Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Došlo je do greške prilikom procesiranja porudžbine' 
      },
      { status: 500 }
    )
  }
} 