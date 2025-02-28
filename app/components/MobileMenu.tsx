'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../context/CartContext'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2 focus:outline-none"
      >
        <FontAwesomeIcon icon={isOpen ? faX : faBars} className="text-2xl" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full right-0 left-0 bg-black border-t border-red-900 p-4 shadow-lg"
          >
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/odjela/1"
                className="text-white hover:text-red-500 transition-colors py-2 px-4"
                onClick={() => setIsOpen(false)}
              >
                Odjela
              </Link>
              <Link 
                href="/majice/2"
                className="text-white hover:text-red-500 transition-colors py-2 px-4"
                onClick={() => setIsOpen(false)}
              >
                Majice
              </Link>
              <Link 
                href="/dukserice/3"
                className="text-white hover:text-red-500 transition-colors py-2 px-4"
                onClick={() => setIsOpen(false)}
              >
                Dukserice
              </Link>
              <Link 
                href="/nalepnice/4"
                className="text-white hover:text-red-500 transition-colors py-2 px-4"
                onClick={() => setIsOpen(false)}
              >
                Nalepnice
              </Link>
              <Link 
                href="/checkout"
                className="flex items-center justify-between text-white hover:text-red-500 transition-colors py-2 px-4"
                onClick={() => setIsOpen(false)}
              >
                <span>Korpa</span>
                <div className="relative">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 