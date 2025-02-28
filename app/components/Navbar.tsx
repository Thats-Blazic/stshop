'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import MobileMenu from './MobileMenu'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { totalItems } = useCart()
  
  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-sm border-b border-red-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/rts-logo.png"
              alt="Logo"
              width={150}
              height={50}
              className="object-contain"
            />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/odjela/1" 
              className="relative group py-2"
            >
              <span className="hover:text-red-500 transition-colors">Odjela</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link 
              href="/majice/2" 
              className="relative group py-2"
            >
              <span className="hover:text-red-500 transition-colors">Majice</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link 
              href="/dukserice/3" 
              className="relative group py-2"
            >
              <span className="hover:text-red-500 transition-colors">Dukserice</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link 
              href="/nalepnice/4" 
              className="relative group py-2"
            >
              <span className="hover:text-red-500 transition-colors">Nalepnice</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/checkout" className="hover:text-red-500 transition-colors relative group">
                <div className="relative">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="absolute -bottom-1 left-1/2 w-6 h-0.5 bg-red-600 transform -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </div>
            
            {/* Mobile Menu */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  )
} 