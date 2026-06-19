export default function MyProgressLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10 pb-24">
        {/* Title */}
        <div className="h-10 w-64 bg-white/20 rounded-xl" />
        {/* World map placeholder */}
        <div className="h-48 bg-white/15 rounded-3xl" />
        {/* Mascot + streak row */}
        <div className="flex flex-wrap gap-8">
          <div className="space-y-3">
            <div className="h-6 w-36 bg-white/20 rounded-lg" />
            <div className="h-28 w-28 bg-white/15 rounded-2xl" />
          </div>
          <div className="space-y-3">
            <div className="h-6 w-36 bg-white/20 rounded-lg" />
            <div className="h-28 w-40 bg-white/15 rounded-2xl" />
          </div>
        </div>
        {/* Badges */}
        <div className="space-y-3">
          <div className="h-6 w-48 bg-white/20 rounded-lg" />
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-white/15 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
