'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ImageSlider() {
  const [currentImage, setCurrentImage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const images = [
    '/oprema/2.jpg',
    '/oprema/3.jpg',
    '/oprema/5.jpg'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      handleImageChange((currentImage + 1) % images.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [currentImage])

  const handleImageChange = (newIndex: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentImage(newIndex)
    setTimeout(() => setIsTransitioning(false), 1500)
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transform transition-all duration-[1500ms] ease-in-out ${
            index === currentImage 
              ? 'translate-x-0 opacity-100' 
              : index < currentImage 
                ? '-translate-x-full opacity-0' 
                : 'translate-x-full opacity-0'
          }`}
          style={{
            zIndex: index === currentImage ? 1 : 0
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            fill
            className="object-cover transform scale-105 transition-transform duration-[1500ms]"
            priority={index === 0}
          />
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleImageChange(index)}
            disabled={isTransitioning}
            className={`h-1.5 transition-all duration-500 ease-in-out rounded-full ${
              index === currentImage 
                ? 'w-8 bg-red-600' 
                : 'w-1.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
} 