export default function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-cream-dark text-warm-grey px-4 py-3 rounded-2xl rounded-bl-md border border-warm-grey/10">
        <div className="flex items-center gap-1">
          <span className="text-sm">Thinking</span>
          <span className="flex gap-1 ml-1">
            <span className="w-1.5 h-1.5 bg-warm-grey/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-warm-grey/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-warm-grey/60 rounded-full animate-bounce" />
          </span>
        </div>
      </div>
    </div>
  )
}
