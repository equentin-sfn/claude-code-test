'use client'

import { useState, useEffect, useRef } from 'react'

const thinkingPhrases = [
  'Browsing the shelves...',
  'Checking our catalogue...',
  'Let me think...',
  'Flicking through the pages...',
  'One moment...',
  'Consulting the stacks...',
  'Hmm, let me see...',
  'Searching the collection...',
  'Just a moment...',
  'Having a rummage...',
  'Let me find something good...',
  'Checking our recommendations...',
  'Thumbing through the index...',
  'Looking into that...',
  'Give me a second...',
  'Diving into the archives...',
  'Pondering...',
  'Scouring the shelves...',
  'On the hunt...',
  'Digging around...',
]

// Track used phrases across component instances
let usedPhrases: Set<number> = new Set()

function getRandomUnusedPhrase(): { phrase: string; index: number } {
  // Reset if all phrases have been used
  if (usedPhrases.size >= thinkingPhrases.length) {
    usedPhrases = new Set()
  }

  // Get available indices
  const availableIndices: number[] = []
  for (let i = 0; i < thinkingPhrases.length; i++) {
    if (!usedPhrases.has(i)) {
      availableIndices.push(i)
    }
  }

  // Pick a random available index
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
  usedPhrases.add(randomIndex)

  return { phrase: thinkingPhrases[randomIndex], index: randomIndex }
}

export default function LoadingIndicator() {
  const [phrase, setPhrase] = useState('')
  const lastIndexRef = useRef<number>(-1)

  useEffect(() => {
    // Get initial phrase
    const initial = getRandomUnusedPhrase()
    setPhrase(initial.phrase)
    lastIndexRef.current = initial.index

    // Rotate through phrases every 2.5 seconds
    const interval = setInterval(() => {
      const next = getRandomUnusedPhrase()
      setPhrase(next.phrase)
      lastIndexRef.current = next.index
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
            {phrase}
          </span>
        </div>
      </div>
    </div>
  )
}
