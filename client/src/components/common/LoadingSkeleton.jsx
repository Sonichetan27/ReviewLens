function Block({ className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-stone-200 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

function LoadingSkeleton({ variant = 'card', count = 1 }) {
  if (variant === 'hero') {
    return (
      <div className="space-y-4">
        <Block className="h-10 w-3/4" />
        <Block className="h-5 w-full" />
        <Block className="h-12 w-40" />
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className="space-y-4">
        <Block className="h-52 w-full rounded-2xl" />
        <Block className="h-8 w-2/3" />
        <Block className="h-4 w-1/2" />
        <div className="space-y-3 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Block key={i} className="h-6 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <Block key={i} className="h-40 w-56 shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white p-3">
          <Block className="mb-3 h-36 w-full" />
          <Block className="mb-2 h-5 w-3/4" />
          <Block className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
