export function Spinner({ text = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="w-9 h-9 rounded-full border-[3px] border-white/10 border-t-cyan-400 animate-spin" />
      <span className="text-white/40 text-sm">{text}</span>
    </div>
  )
}

export function ErrorCard({ msg }) {
  return (
    <div className="text-center py-20">
      <p className="text-red-400 text-lg font-semibold mb-2">⚠ {msg}</p>
      <p className="text-white/35 text-sm">Check your connection — NASA's rate limit may need a moment to reset.</p>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="aspect-square shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-2 w-1/2 rounded shimmer" />
        <div className="h-3 w-3/4 rounded shimmer" />
      </div>
    </div>
  )
}
