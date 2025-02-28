'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCreditCard, faLock, faTruck, faGlobe, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../context/CartContext'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Inicijalizacija Stripe-a
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const deliveryOptions = {
  'Hrvatska': [
    { id: 'hp', name: 'Hrvatska Pošta', price: 20, time: '2-3 radna dana' },
    { id: 'tisak', name: 'Tisak Dostava', price: 15, time: '1-2 radna dana' }
  ],
  'Slovenija': [
    { id: 'posta', name: 'Pošta Slovenije', price: 25, time: '3-4 radna dana' }
  ],
  'Srbija': [
    { id: 'post', name: 'Post Express', price: 30, time: '3-4 radna dana' }
  ],
  'Bosna i Hercegovina': [
    { id: 'bh-post', name: 'BH Pošta', price: 30, time: '3-4 radna dana' }
  ]
} as const

type Country = keyof typeof deliveryOptions;
type DeliveryOption = typeof deliveryOptions[Country][number];

function CheckoutForm() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const stripe = useStripe()
  const elements = useElements()
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Hrvatska' as Country,
    deliveryMethod: 'hp',
  })

  const [deliveryPrice, setDeliveryPrice] = useState(20)

  useEffect(() => {
    const selectedDelivery = deliveryOptions[formData.country].find(
      (option: DeliveryOption) => option.id === formData.deliveryMethod
    )
    setDeliveryPrice(selectedDelivery?.price || 0)
  }, [formData.country, formData.deliveryMethod])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'cardNumber') {
      // Formatiranje broja kartice (dodavanje razmaka nakon svaka 4 broja)
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      setFormData(prev => ({ ...prev, [name]: formatted }))
    } else if (name === 'expiryDate') {
      // Formatiranje datuma isteka (MM/YY format)
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substr(0, 5)
      setFormData(prev => ({ ...prev, [name]: formatted }))
    } else if (name === 'cvv') {
      // Samo brojevi za CVV
      const formatted = value.replace(/\D/g, '').substr(0, 3)
      setFormData(prev => ({ ...prev, [name]: formatted }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Unesite ispravnu email adresu')
      return false
    }
    if (!formData.name || formData.name.length < 3) {
      setError('Unesite ime i prezime')
      return false
    }
    if (!formData.address) {
      setError('Unesite adresu')
      return false
    }
    if (!formData.city) {
      setError('Unesite grad')
      return false
    }
    if (!formData.postalCode) {
      setError('Unesite poštanski broj')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      // First, create the payment intent
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderDetails: {
            items,
            totalPrice,
            deliveryPrice,
            totalAmount: totalPrice + deliveryPrice,
          },
          customerDetails: formData,
          confirmPayment: false
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Došlo je do greške prilikom procesiranja narudžbe')
      }

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: formData.name,
            email: formData.email,
          },
        },
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      // If payment is successful, complete the order
      if (paymentIntent.status === 'succeeded') {
        const confirmResponse = await fetch('/api/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderDetails: {
              items,
              totalPrice,
              deliveryPrice,
              totalAmount: totalPrice + deliveryPrice,
            },
            customerDetails: formData,
            confirmPayment: true,
            paymentIntentId: paymentIntent.id
          }),
        })

        if (!confirmResponse.ok) {
          throw new Error('Došlo je do greške prilikom potvrde narudžbe')
        }

        // Clear cart and redirect to success page
        router.push('/success')
      }
    } catch (err: any) {
      setError(err.message || 'Došlo je do greške prilikom procesiranja narudžbe')
      console.error('Order Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pt-16 pb-8 px-4 md:pt-24 md:px-0">
      {/* Modern gradient background */}
      <div className="fixed inset-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_rgba(220,38,38,0.15),rgba(0,0,0,0)_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(220,38,38,0.1),rgba(0,0,0,0)_50%)]" />
      </div>

      <div className="container mx-auto relative">
        <Link 
          href="/"
          className="absolute top-0 left-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm md:text-base"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          <span>Nazad na početnu</span>
        </Link>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Cart Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 md:space-y-6"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Vaša Košarica</h2>
            <div className="space-y-3 md:space-y-4">
              {items.map((item) => (
                <div 
                  key={`${item.id}-${item.size}`}
                  className="bg-gradient-to-r from-gray-900 to-black p-3 md:p-4 rounded-xl border border-red-900/20 flex items-center gap-3 md:gap-4"
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-sm md:text-base truncate">{item.name}</h3>
                    <p className="text-gray-400 text-sm">Veličina: {item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-bold text-red-500 text-sm md:text-base">{item.price} €</p>
                      <div className="flex items-center gap-2 md:gap-4">
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="bg-gray-800 rounded-lg px-2 py-1 text-sm"
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 transition-colors p-1"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-4 space-y-2">
              <div className="flex justify-between items-center text-sm md:text-base">
                <span>Međuzbir:</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base">
                <span>Dostava:</span>
                <span>{deliveryPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center text-lg md:text-xl font-bold pt-2 border-t border-gray-800">
                <span>Ukupno:</span>
                <span className="text-red-500">{(totalPrice + deliveryPrice).toFixed(2)} €</span>
              </div>

              {/* Security Notices */}
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-800">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 text-gray-400 bg-gray-900/50 p-3 rounded-lg">
                    <FontAwesomeIcon icon={faLock} className="text-red-500 text-lg md:text-xl flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white text-sm md:text-base">Sigurno Plaćanje</h3>
                      <p className="text-xs md:text-sm">SSL enkripcija za sigurne transakcije</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 bg-gray-900/50 p-3 rounded-lg">
                    <FontAwesomeIcon icon={faTruck} className="text-red-500 text-lg md:text-xl flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white text-sm md:text-base">Brza Dostava</h3>
                      <p className="text-xs md:text-sm">Pouzdana dostava do vaših vrata</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 bg-gray-900/50 p-3 rounded-lg">
                    <FontAwesomeIcon icon={faGlobe} className="text-red-500 text-lg md:text-xl flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white text-sm md:text-base">Globalna Podrška</h3>
                      <p className="text-xs md:text-sm">24/7 korisnička podrška</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-gray-900 to-black p-4 md:p-6 rounded-xl md:rounded-2xl border border-red-900/20"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Informacije o Plaćanju</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ime i Prezime</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Adresa</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Grad</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Poštanski Broj</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faGlobe} />
                      Država
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      {Object.keys(deliveryOptions).map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faTruck} />
                      Način Dostave
                    </label>
                    <div className="space-y-2">
                      {deliveryOptions[formData.country as Country].map((option: DeliveryOption) => (
                        <label key={option.id} className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value={option.id}
                            checked={formData.deliveryMethod === option.id}
                            onChange={handleInputChange}
                            className="mr-3"
                          />
                          <div className="flex-grow">
                            <div className="font-medium">{option.name}</div>
                            <div className="text-sm text-gray-400">{option.time}</div>
                          </div>
                          <div className="font-bold text-red-500">{option.price} €</div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCreditCard} />
                    Podaci o Kartici
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#ffffff',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                          },
                          hidePostalCode: true
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500/10 border border-red-500 text-red-500 px-6 py-3 rounded-lg z-50">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faLock} />
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Procesiranje...
                  </span>
                ) : (
                  `Plati ${(totalPrice + deliveryPrice).toFixed(2)} €`
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
} 