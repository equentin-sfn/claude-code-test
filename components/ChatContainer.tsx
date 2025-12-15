'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import ChatMessage from './ChatMessage'
import LoadingIndicator from './LoadingIndicator'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
}

interface ChatContainerProps {
  messages: Message[]
  isLoading?: boolean
  onSuggestionClick?: (suggestion: string) => void
}

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return 'Good morning. What are you in the mood to listen to today?'
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon. Looking for your next listen?'
  } else if (hour >= 17 && hour < 21) {
    return 'Good evening. Something cosy for tonight?'
  } else {
    return "Burning the midnight oil? We've got just the thing."
  }
}

export default function ChatContainer({ messages, isLoading, onSuggestionClick }: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [greeting, setGreeting] = useState<string>('')

  // Set greeting on mount (client-side only to avoid hydration mismatch)
  useEffect(() => {
    setGreeting(getTimeBasedGreeting())
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 md:p-8">
        <div className="text-center max-w-md animate-fade-in">
          <div className="flex justify-center mb-6">
            <Image
              src="/spiracle-logo.png"
              alt="Spiracle"
              width={140}
              height={38}
              className="h-8 md:h-10 w-auto opacity-80"
            />
          </div>
          <p className="text-black text-lg md:text-xl mb-2 font-serif">
            {greeting || 'Welcome to the Spiracle Librarian'}
          </p>
          <p className="text-warm-grey/70 text-sm md:text-base leading-relaxed">
            Ask me anything about audiobooks, authors, or the Spiracle platform.
            I&apos;m here to help you discover your next great listen.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => onSuggestionClick?.('Recommend a book')}
              className="text-xs px-3 py-1.5 bg-cream-dark text-warm-grey rounded-full border border-warm-grey/10
                         hover:bg-warm-cream hover:border-warm-grey/20 transition-colors cursor-pointer"
            >
              Recommend a book
            </button>
            <button
              onClick={() => onSuggestionClick?.("What's new?")}
              className="text-xs px-3 py-1.5 bg-cream-dark text-warm-grey rounded-full border border-warm-grey/10
                         hover:bg-warm-cream hover:border-warm-grey/20 transition-colors cursor-pointer"
            >
              What&apos;s new?
            </button>
            <button
              onClick={() => onSuggestionClick?.('Any staff picks this week?')}
              className="text-xs px-3 py-1.5 bg-cream-dark text-warm-grey rounded-full border border-warm-grey/10
                         hover:bg-warm-cream hover:border-warm-grey/20 transition-colors cursor-pointer"
            >
              Any staff picks this week?
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className="animate-slide-up"
            style={{ animationDelay: `${Math.min(index * 50, 200)}ms` }}
          >
            <ChatMessage
              content={message.content}
              role={message.role}
            />
          </div>
        ))}
        {isLoading && (
          <div className="animate-fade-in">
            <LoadingIndicator />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
