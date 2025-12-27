export default function Footer() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0'
  const commit = process.env.NEXT_PUBLIC_GIT_COMMIT || 'unknown'
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown'

  return (
    <footer className="text-center text-warm-grey/50 text-xs py-2">
      v{version} • {commit} • {buildTime}
    </footer>
  )
}
