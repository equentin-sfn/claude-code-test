'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import ChatContainer, { Message } from '@/components/ChatContainer'
import ChatInput from '@/components/ChatInput'

const STORAGE_KEY = 'spiracle-chat'
const SESSION_KEY = 'spiracle-session-id'

function generateSessionId(): string {
  return crypto.randomUUID()
}

function getStoredMessages(): Message[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function getSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId()
  let sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (message.includes('timeout') || message.includes('taking a while')) {
      return 'The Librarian is taking a while to think. Please try again.'
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'Connection issue. Please check your internet and try again.'
    }
    if (message.includes('unauthorised') || message.includes('unauthorized')) {
      return 'Your session has expired. Please refresh the page and log in again.'
    }

    return error.message
  }
  return 'Something went wrong. Please try again.'
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [inputValue, setInputValue] = useState('')

  // Load messages and session from localStorage on mount
  useEffect(() => {
    setMessages(getStoredMessages())
    setSessionId(getSessionId())
  }, [])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInputValue(suggestion)
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  const handleNewChat = useCallback(() => {
    const newSessionId = generateSessionId()
    localStorage.setItem(SESSION_KEY, newSessionId)
    localStorage.removeItem(STORAGE_KEY)
    setSessionId(newSessionId)
    setMessages([])
  }, [])

  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          sessionId,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.response,
        role: 'assistant',
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      // Add error message as assistant response
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: getFriendlyErrorMessage(error),
        role: 'assistant',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  return (
    <div className="flex flex-col h-[100dvh] bg-cream">
      <Header onNewChat={handleNewChat} />

      <ChatContainer messages={messages} isLoading={isLoading} onSuggestionClick={handleSuggestionClick} />

      <div className="border-t border-warm-grey/20 bg-cream/80 backdrop-blur-sm p-4 md:p-6 pb-safe">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={handleSendMessage}
            disabled={isLoading}
            value={inputValue}
            onChange={setInputValue}
          />
        </div>
      </div>
    </div>
  )
}
