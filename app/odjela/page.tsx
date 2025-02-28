'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

// Privremeni podaci za odela (kasnije ćemo povezati sa pravom bazom)
const suits = [
  {
    id: 1,
    name: "Racing Pro GP Odelo",
    price: 899.99,
    image: "/oprema/2.jpg",
    category: "Racing",
    badge: "Najprodavanije"
  },
  {
    id: 2,
    name: "Sport Touring Odelo",
    price: 699.99,
    image: "/oprema/2.jpg",
    category: "Touring",
    badge: null
  },
  {
    id: 3,
    name: "Urban Leather Odelo",
    price: 599.99,
    image: "/oprema/2.jpg",
    category: "Urban",
    badge: "Novo"
  },
  {
    id: 4,
    name: "Track Day Pro Odelo",
    price: 799.99,
    image: "/oprema/2.jpg",
    category: "Racing",
    badge: null
  }
]

const categories = ["Sve", "Racing", "Touring", "Urban"]

export default function OdelaPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/odjela/1') // Redirekcija na stranicu sa detaljima odela
  }, [router])

  return null
} 