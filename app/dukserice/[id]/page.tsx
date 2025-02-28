'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faMinus, faPlus, faCheck, faSearch, faUser, faTshirt, faTemperatureHigh, faWater } from '@fortawesome/free-solid-svg-icons'
import MobileMenu from '../../components/MobileMenu'
import { useCart } from '../../context/CartContext'
import Navbar from '../../components/Navbar'

const hoodieData = {
  id: 3,
  name: "ST Comfort Dukserica",
  price: 55,
  description: "Udobna dukserica sa kapuljačom, izrađena od mekanog materijala sa ST logom.",
  features: [
    {
      icon: faTshirt,
      title: "Mekani Materijal",
      description: "80% pamuk, 20% poliester"
    },
    {
      icon: faTemperatureHigh,
      title: "Topla i Udobna",
      description: "Idealna za hladnije dane"
    },
    {
      icon: faWater,
      title: "Lako Održavanje",
      description: "Postojane boje"
    }
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
  images: ["/oprema/2.jpg", "/oprema/3.jpg", "/oprema/5.jpg"]
}

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(hoodieData.sizes[0])
  const [showCartNotification, setShowCartNotification] = useState(false)
  const { addItem, totalItems } = useCart()

  const totalPrice = hoodieData.price * quantity

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10) setQuantity(value)
  }

  const addToCart = () => {
    addItem({
      id: hoodieData.id,
      name: hoodieData.name,
      price: hoodieData.price,
      quantity: quantity,
      size: selectedSize,
      image: hoodieData.images[0],
      color: "Crna"
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
                  src={hoodieData.images[selectedImage]}
                  alt={hoodieData.name}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>
              <div className="grid grid-cols-3 gap-3">
                {hoodieData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-gray-900 border-2 transition-all ${
                      selectedImage === index ? 'border-red-600' : 'border-transparent hover:border-red-600/50'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${hoodieData.name} ${index + 1}`}
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
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{hoodieData.name}</h1>
                <p className="text-gray-400 text-lg mb-4">{hoodieData.description}</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-bold text-red-600">{totalPrice} €</p>
                  {quantity > 1 && (
                    <span className="text-gray-400">({hoodieData.price} € po komadu)</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 py-4">
                {hoodieData.features.map((feature, index) => (
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
                  {hoodieData.sizes.map((size) => (
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

      {/* Cart Notification */}
      <AnimatePresence>
        {showCartNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCheck} />
            Proizvod dodan u košaricu
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 