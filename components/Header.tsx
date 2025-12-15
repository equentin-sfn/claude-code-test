'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface HeaderProps {
  onNewChat?: () => void
}

export default function Header({ onNewChat }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-warm-grey/20 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
      <Image
        src="/spiracle-logo.png"
        alt="Spiracle"
        width={120}
        height={32}
        className="h-6 md:h-7 w-auto"
        priority
      />
      <div className="flex items-center gap-2 md:gap-4">
        {onNewChat && (
          <button
            onClick={onNewChat}
            className="text-xs md:text-sm text-warm-grey hover:text-green active:text-green-dark
                       transition-colors px-2 py-1 rounded-md hover:bg-warm-grey/5"
          >
            New chat
          </button>
        )}
        <button
          onClick={handleLogout}
          className="text-xs md:text-sm text-warm-grey hover:text-green active:text-green-dark
                     transition-colors px-2 py-1 rounded-md hover:bg-warm-grey/5"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
