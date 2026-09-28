function AspectBar({ label, score }) {
  const value = score == null ? 0 : score;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted">{label}</span>
        <span className="text-sm font-bold text-ink">{score == null ? '—' : `${Math.round(score)}/100`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-200">
        <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default AspectBar;
