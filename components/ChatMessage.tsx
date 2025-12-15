import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
  content: string
  role: 'user' | 'assistant'
}

export default function ChatMessage({ content, role }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-black text-cream rounded-br-md'
            : 'bg-cream-dark text-black rounded-bl-md border border-warm-grey/10'
        }`}
      >
        {isUser ? (
          <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        ) : (
          <div className="text-sm md:text-base leading-[2.1] prose prose-sm prose-stone max-w-none
                          prose-p:mb-[1.75em] prose-p:mt-0 prose-p:last:mb-0
                          prose-strong:text-black prose-strong:font-semibold
                          prose-ul:my-6 prose-li:my-3
                          prose-headings:text-black prose-headings:font-serif">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
