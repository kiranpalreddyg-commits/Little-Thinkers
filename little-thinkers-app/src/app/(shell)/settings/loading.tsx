export default function SettingsLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        {/* Title */}
        <div className="h-10 w-36 bg-white/20 rounded-xl mb-8" />
        {/* Settings panel */}
        <div className="bg-white/10 rounded-3xl p-6 space-y-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="h-5 w-40 bg-gray-200/60 rounded-lg" />
                <div className="h-3.5 w-56 bg-gray-100/60 rounded-md" />
              </div>
              <div className="h-7 w-12 bg-gray-200/60 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
