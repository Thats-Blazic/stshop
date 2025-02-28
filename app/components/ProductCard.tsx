'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface ProductCardProps {
  name: string
  category: string
  price: number
  image: string
  badge?: string | null
}

const MotionDiv = motion.div

export default function ProductCard({ name, category, price, image, badge }: ProductCardProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden group"
    >
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        {badge && (
          <span className="absolute top-4 right-4 z-20 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            {badge}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <p className="text-gray-400 text-sm mb-1">{category}</p>
          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-red-500 font-bold text-xl">{price} €</span>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transform hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
              Dodaj u korpu
            </button>
          </div>
        </div>
      </div>
    </MotionDiv>
  )
} 