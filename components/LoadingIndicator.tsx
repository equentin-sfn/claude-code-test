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
        <div className="flex items-center gap-2">
          {/* Subtle book/page animation */}
          <div className="relative w-4 h-4 flex items-center justify-center">
            <span className="absolute w-3 h-3.5 border border-warm-grey/40 rounded-sm bg-cream animate-page-flip origin-left" />
            <span className="w-3 h-3.5 border border-warm-grey/30 rounded-sm bg-cream-dark" />
          </div>
          <span className="text-sm transition-opacity duration-300">
            {thinkingPhrases[phraseIndex]}
          </span>
        </div>
      </div>
    </div>
  )
}
