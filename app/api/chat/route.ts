import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { sendMessageToN8n } from '@/lib/n8n'

export async function POST(request: NextRequest) {
  // Check authentication
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json(
      { error: 'Unauthorised' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { message, sessionId } = body

    // Validate request
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Send to n8n
    const response = await sendMessageToN8n(message, sessionId)

    return NextResponse.json({
      response: response.response,
      sessionId: response.sessionId,
    })
  } catch (error) {
    console.error('Chat API error:', error)

    const errorMessage = error instanceof Error
      ? error.message
      : 'Something went wrong. Please try again.'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
