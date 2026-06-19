export default function PlayLoading() {
  return (
    <div className="min-h-screen pb-24 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header */}
        <div className="h-9 w-20 bg-white/20 rounded-xl mb-2" />
        <div className="h-4 w-52 bg-white/15 rounded-lg mb-6" />
        {/* Daily challenge */}
        <div className="h-24 bg-white/20 rounded-3xl mb-4" />
        {/* Game cards */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-white/20 rounded-2xl mb-3" />
        ))}
      </div>
    </div>
  );
}
