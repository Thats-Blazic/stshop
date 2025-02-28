'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faMinus, faPlus, faCheck, faSearch, faUser, faShield, faWind, faTemperatureHigh } from '@fortawesome/free-solid-svg-icons'
import MobileMenu from '../../components/MobileMenu'
import { useCart } from '../../context/CartContext'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'

// Privremeni podaci za odelo (kasnije ćemo povezati sa pravom bazom)
const suitData = {
  id: 1,
  name: "ST MOTO GP Odelo",
  price: 750,
  description: "Profesionalno trkačko odelo izrađeno od premium kože sa naprednim sigurnosnim karakteristikama.",
  features: [
    {
      icon: faShield,
      title: "CE Level 2 Zaštita",
      description: "Premium koža sa naprednim štitnicima"
    },
    {
      icon: faWind,
      title: "3D Ventilacija",
      description: "Optimalna cirkulacija vazduha"
    },
    {
      icon: faTemperatureHigh,
      title: "4-Season Comfort",
      description: "Udobnost u svim vremenskim uslovima"
    }
  ],
  sizes: ["48", "50", "52", "54", "56", "58"],
  images: [
    "/oprema/2.jpg",
    "/oprema/3.jpg",
    "/oprema/5.jpg"
  ]
}

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(suitData.sizes[0])
  const [showCartNotification, setShowCartNotification] = useState(false)
  const [showCartPreview, setShowCartPreview] = useState(false)
  const { addItem, totalItems, items, removeItem } = useCart()
  const router = useRouter()

  const totalPrice = suitData.price * quantity

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setQuantity(value)
    }
  }

  const addToCart = () => {
    addItem({
      id: suitData.id,
      name: suitData.name,
      price: suitData.price,
      quantity: quantity,
      size: selectedSize,
      image: suitData.images[0],
      color: "Crna/Crvena" // Default color
    })
    setShowCartNotification(true)
    setTimeout(() => setShowCartNotification(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <motion.div 
                className="relative aspect-square rounded-2xl overflow-hidden bg-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Image
                  src={suitData.images[selectedImage]}
                  alt={suitData.name}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>
              <div className="grid grid-cols-3 gap-3">
                {suitData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-gray-900 border-2 transition-all ${
                      selectedImage === index ? 'border-red-600' : 'border-transparent hover:border-red-600/50'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${suitData.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{suitData.name}</h1>
                <p className="text-gray-400 text-lg mb-4">{suitData.description}</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-bold text-red-600">{totalPrice} €</p>
                  {quantity > 1 && (
                    <span className="text-gray-400">({suitData.price} € po komadu)</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 py-4">
                {suitData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/50 p-4 rounded-xl text-center"
                  >
                    <div className="bg-red-600/10 p-3 rounded-lg inline-block mb-2">
                      <FontAwesomeIcon icon={feature.icon} className="text-red-500 text-xl" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-xs">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Veličina</h3>
                <div className="flex flex-wrap gap-2">
                  {suitData.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-3 py-2 rounded-lg border transition-all ${
                        selectedSize === size
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-gray-600 hover:border-red-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Količina</h3>
                <div className="flex items-center space-x-4 bg-gray-900/50 w-fit rounded-lg p-2">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className="text-xl font-bold min-w-[2rem] text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={addToCart}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl text-lg font-semibold transition-all hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-600/20 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                <span>Dodaj u košaricu - {totalPrice} €</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-red-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">O nama</h3>
              <p className="text-gray-400">Vaš pouzdani partner za kvalitetnu opremu i odeću.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Brzi linkovi</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-red-500 transition-colors">O nama</Link></li>
                <li><Link href="/contact" className="hover:text-red-500 transition-colors">Kontakt</Link></li>
                <li><Link href="/shipping" className="hover:text-red-500 transition-colors">Dostava</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Kontakt</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@example.com</li>
                <li>Tel: +123 456 789</li>
                <li>Adresa: Ulica bb, Grad</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Newsletter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Vaš email"
                  className="bg-gray-800 px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button className="bg-red-600 hover:bg-red-700 px-6 rounded-r-full transition-colors">
                  Prijavi se
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 ST Moto Shop. Sva prava zadržana.</p>
          </div>
        </div>
      </footer>

      {/* Cart Notification */}
      <AnimatePresence>
        {showCartNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCheck} />
            Proizvod dodan u košaricu
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 