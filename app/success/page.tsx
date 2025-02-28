'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faHome } from '@fortawesome/free-solid-svg-icons'

export default function SuccessPage() {
  useEffect(() => {
    // Čistimo URL od Stripe parametara
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gradient-to-r from-gray-900 to-black p-8 rounded-2xl border border-red-900/20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl text-green-500 mb-6"
        >
          <FontAwesomeIcon icon={faCheckCircle} />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-4">Hvala na kupovini!</h1>
        <p className="text-gray-400 mb-8">
          Vaša porudžbina je uspešno primljena. Poslali smo vam email sa detaljima porudžbine.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-full text-lg font-medium transition-all transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faHome} />
          Nazad na početnu
        </Link>
      </motion.div>
    </main>
  )
} 