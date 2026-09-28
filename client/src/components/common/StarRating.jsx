function StarRating({ value = 0 }) {
  const rounded = Math.round(value * 10) / 10;
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
      <svg className="h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.26 3.88a1 1 0 0 0 .95.69h4.08c.97 0 1.37 1.24.59 1.81l-3.3 2.4a1 1 0 0 0-.36 1.12l1.26 3.88c.3.92-.76 1.69-1.54 1.12l-3.3-2.4a1 1 0 0 0-1.18 0l-3.3 2.4c-.78.57-1.84-.2-1.54-1.12l1.26-3.88a1 1 0 0 0-.36-1.12l-3.3-2.4c-.78-.57-.38-1.81.59-1.81h4.08a1 1 0 0 0 .95-.69l1.26-3.88Z" />
      </svg>
      <span className="text-lg font-bold leading-none">{rounded.toFixed(1)}</span>
    </span>
  );
}

export default StarRating;
