'use client'

import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faUser, faSearch, faEye, faStar, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import ImageSlider from './components/ImageSlider'
import MobileMenu from './components/MobileMenu'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useCart } from './context/CartContext'
import Navbar from './components/Navbar'

const MotionDiv = motion.div

// Sample data
const featuredProducts = [
  {
    id: 1,
    name: 'ST Racing Odijelo',
    description: 'Profesionalno trkačko odijelo sa naprednom zaštitom',
    price: '750€',
    image: '/oprema/2.jpg',
    link: '/odjela/1'
  },
  {
    id: 2,
    name: 'ST Racing Majica',
    description: 'Udobna majica sa ST Racing logom',
    price: '35€',
    image: '/oprema/2.jpg',
    link: '/majice/2'
  },
  {
    id: 3,
    name: 'ST Comfort Dukserica',
    description: 'Topla i udobna dukserica sa kapuljačom',
    price: '55€',
    image: '/oprema/3.jpg',
    link: '/dukserice/3'
  },
  {
    id: 4,
    name: 'ST Racing Nalepnica',
    description: 'Vodootporna nalepnica visokog kvaliteta',
    price: '15€',
    image: '/oprema/5.jpg',
    link: '/nalepnice/4'
  }
]

const categoryData = {
  URBAN: {
    image: "/oprema/2.jpg",
    title: "Urbana Kolekcija",
    description: "Moderna i funkcionalna oprema za svakodnevnu gradsku vožnju. Kombinacija stila i sigurnosti za urbane vozače.",
    features: "Reflektujući elementi, vodootporna konstrukcija, moderan dizajn"
  },
  "SPORT&FUN": {
    image: "/oprema/2.jpg",
    title: "Sport & Fun Linija",
    description: "Aerodinamična oprema za maksimalne performanse. Savršena za vikend vožnje i sportske aktivnosti.",
    features: "Aerodinamični kroj, ventilacija, zaštita od udara"
  },
  TOURING: {
    image: "/oprema/2.jpg",
    title: "Touring Oprema",
    description: "Komforna oprema za duga putovanja. Prilagodljiva svim vremenskim uslovima i dugim relacijama.",
    features: "Višeslojna konstrukcija, brojni džepovi, termo regulacija"
  },
  RACING: {
    image: "/oprema/2.jpg",
    title: "Racing Kolekcija",
    description: "Profesionalna oprema za stazu. Maksimalna zaštita i performanse za trkačke uslove.",
    features: "Aerogrba, slider-i, premium koža, racing kroj"
  }
} as const

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof categoryData>("URBAN")
  const { totalItems } = useCart()
  
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Modern Hero Section with Slider */}
      <section className="relative h-screen">
        <div className="absolute inset-0 z-10">
          <div className="relative h-full">
            <ImageSlider />
          </div>
        </div>
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/80 to-black/70">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                Otkrijte Našu
                <span className="block text-red-600 mt-2">Premium Kolekciju</span>
              </h1>
              <p className="text-xl mb-8 text-gray-300 max-w-lg">
                Ekskluzivna ponuda opreme i odeće za sve ljubitelje kvaliteta i stila
              </p>
              <div className="flex space-x-4">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/50">
                  Istraži ponudu
                </button>
                <button className="border-2 border-white hover:border-red-600 text-white px-8 py-4 rounded-full transition-all transform hover:scale-105">
                  Nova kolekcija
                </button>
              </div>
              </div>
            </div>
          </div>
        </section>

      {/* Featured Products Section */}
      <section className="py-24 relative overflow-hidden bg-black">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(220,38,38,0.1),transparent_70%)]"
          />
              </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              viewport={{ once: true }}
              className="h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-6"
            />
            <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-red-500 to-white mb-6">
              Istaknuti Proizvodi
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Otkrijte našu premium kolekciju motociklističke opreme dizajnirane za vrhunske performanse i stil
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  bounce: 0.4
                }}
                whileHover={{ y: -10 }}
                className="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl overflow-hidden shadow-xl shadow-red-900/10 border border-gray-800/50 hover:border-red-500/50 transition-all duration-500"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-red-600/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full"
                  >
                    Premium
                  </motion.div>
            </div>

                {/* Image container */}
                <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                    src={product.image}
                      alt={product.name}
                      fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"/>
                  
                  {/* Quick view button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Link href={product.link} className="bg-red-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-full transform hover:scale-105 transition-transform duration-300 flex items-center gap-2">
                      <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                      <span>Brzi pregled</span>
                    </Link>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6 relative">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon 
                        key={i} 
                        icon={faStar} 
                        className="w-4 h-4 text-yellow-500"
                      />
                    ))}
                    <span className="text-gray-400 text-sm ml-2">(5.0)</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors duration-300">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {product.description}
                  </p>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400">Cena</span>
                      <span className="text-2xl font-bold text-white">{product.price}</span>
                    </div>
                    
                    <Link href={product.link}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-full flex items-center gap-2 transform group-hover:translate-x-2 transition-transform duration-300 shadow-lg shadow-red-600/20"
                      >
                        <span>Pogledaj</span>
                        <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>

                  {/* Hover effect overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent pointer-events-none"
                  />
                    </div>
              </motion.div>
              ))}
            </div>
          </div>
        </section>

      {/* Category Showcase Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0.5 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl blur opacity-20"></div>
              <div className="relative h-full w-full">
                <Image
                  src={categoryData[activeCategory].image}
                  alt={categoryData[activeCategory].title}
                  fill
                  className="object-cover rounded-2xl transition-all duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
            </MotionDiv>

            {/* Content Side */}
            <MotionDiv
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="bg-red-600/20 text-red-500 px-4 py-1 rounded-full text-sm font-medium">
                  Premium Oprema
                </span>
                <MotionDiv
                  key={categoryData[activeCategory].title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                    {categoryData[activeCategory].title}
                  </h2>
                  <p className="text-gray-300 text-lg">
                    {categoryData[activeCategory].description}
                  </p>
                </MotionDiv>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.keys(categoryData).map((category) => (
                  <MotionDiv
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onClick={() => setActiveCategory(category as keyof typeof categoryData)}
                    className={`group cursor-pointer ${
                      category === activeCategory 
                        ? "bg-red-600" 
                        : "bg-black/30 hover:bg-red-600/20"
                    } rounded-xl p-4 border border-red-900/10 transition-all duration-300`}
                  >
                    <h3 className={`text-lg font-bold ${
                      category === activeCategory 
                        ? "text-white" 
                        : "text-gray-400 group-hover:text-red-500"
                    } transition-colors`}>
                      {category}
                    </h3>
                  </MotionDiv>
                ))}
              </div>

              <MotionDiv
                key={activeCategory + "-features"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="bg-black/30 p-4 rounded-xl border border-red-900/10">
                  <p className="text-gray-400">
                    <span className="text-red-500 font-semibold">Karakteristike:</span> {categoryData[activeCategory].features}
                  </p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/50 flex items-center space-x-2">
                  <span>Otkrij Kolekciju</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </MotionDiv>
            </MotionDiv>
            </div>
          </div>
        </section>

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
      </main>
  )
}

const categories = [
  {
    id: 1,
    name: "Motorcycle Gear",
    slug: "motorcycle-gear",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 2,
    name: "T-Shirts",
    slug: "t-shirts",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    name: "Suits",
    slug: "suits",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 4,
    name: "Stickers",
    slug: "stickers",
    image: "/placeholder.svg?height=400&width=400",
  },
]

