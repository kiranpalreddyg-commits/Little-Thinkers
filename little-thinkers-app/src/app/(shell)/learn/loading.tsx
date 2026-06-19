export default function LearnLoading() {
  return (
    <div className="min-h-screen pb-24 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-9 w-28 bg-white/20 rounded-xl" />
            <div className="h-4 w-56 bg-white/15 rounded-lg" />
          </div>
          <div className="h-10 w-36 bg-white/20 rounded-full" />
        </div>
        {/* Content panels */}
        <div className="bg-white/10 rounded-[2rem] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="h-6 w-40 bg-gray-200/60 rounded-lg" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100/60 rounded-xl" />
              ))}
            </div>
            <div className="space-y-3">
              <div className="h-6 w-32 bg-gray-200/60 rounded-lg" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100/60 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
