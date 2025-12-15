interface N8nRequest {
  action: 'sendMessage'
  sessionId: string
  chatInput: string
}

interface N8nResponse {
  response: string
  sessionId: string
}

interface N8nError {
  error: string
}

const TIMEOUT_MS = 60000 // 60 seconds

export async function sendMessageToN8n(
  message: string,
  sessionId: string
): Promise<N8nResponse> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    throw new Error('N8N_WEBHOOK_URL environment variable not set')
  }

  const requestBody: N8nRequest = {
    action: 'sendMessage',
    sessionId,
    chatInput: message,
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`n8n returned status ${response.status}`)
    }

    const data = await response.json() as N8nResponse | N8nError

    if ('error' in data) {
      throw new Error(data.error)
    }

    return data as N8nResponse
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('The Librarian is taking a while to think. Please try again.')
      }
      throw error
    }

    throw new Error('Something went wrong. Please try again.')
  }
}
