export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#f5f5f5] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-black/5" />
          <div className="absolute inset-0 rounded-full border-2 border-t-black/40 animate-spin" />
        </div>
        <p className="eyebrow text-[10px] tracking-[0.6em] text-[#a3a3a3] uppercase">Immersion en cours</p>
      </div>
    </div>
  )
}
