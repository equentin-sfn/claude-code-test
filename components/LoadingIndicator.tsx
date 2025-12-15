'use client'

import { useState, useEffect } from 'react'

const thinkingPhrases = [
  'Browsing the shelves...',
  'Checking our catalogue...',
  'Let me think...',
  'Flicking through the pages...',
  'One moment...',
]

export default function LoadingIndicator() {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    // Start with a random phrase
    setPhraseIndex(Math.floor(Math.random() * thinkingPhrases.length))

    // Rotate through phrases every 2.5 seconds
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % thinkingPhrases.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex justify-start">
      <div className="bg-cream-dark text-warm-grey px-4 py-3 rounded-2xl rounded-bl-md border border-warm-grey/10">
        <div className="flex items-center gap-3">
          {/* Open book with flipping pages */}
          <div className="relative w-5 h-4 flex items-center justify-center">
            {/* Book spine/base */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-warm-grey/30 rounded-full" />

            {/* Left page (static) */}
            <div className="absolute left-0 bottom-0 w-2 h-3 bg-cream border border-warm-grey/20 rounded-l-sm origin-right"
                 style={{ transform: 'rotateY(-30deg) skewY(-2deg)' }} />

            {/* Right page (static) */}
            <div className="absolute right-0 bottom-0 w-2 h-3 bg-cream border border-warm-grey/20 rounded-r-sm origin-left"
                 style={{ transform: 'rotateY(30deg) skewY(2deg)' }} />

            {/* Flipping pages */}
            <div className="absolute right-0.5 bottom-0 w-2 h-3 bg-cream-dark border border-warm-grey/25 rounded-r-sm origin-left animate-page-turn"
                 style={{ transformStyle: 'preserve-3d' }} />
            <div className="absolute right-0.5 bottom-0 w-2 h-3 bg-cream border border-warm-grey/20 rounded-r-sm origin-left animate-page-turn-delayed"
                 style={{ transformStyle: 'preserve-3d' }} />
          </div>

          <span className="text-sm transition-opacity duration-300">
            {thinkingPhrases[phraseIndex]}
          </span>
        </div>
      </div>
    </div>
  )
}
