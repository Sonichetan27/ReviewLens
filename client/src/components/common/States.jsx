import Button from './Button.jsx';

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white px-5 py-8 text-center shadow-card">
      <p className="text-base font-semibold text-ink">We couldn&apos;t load this.</p>
      <p className="mt-2 break-words text-sm text-muted">{message || 'Please try again in a moment.'}</p>
      {onRetry ? (
        <Button className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white px-5 py-10 text-center">
      <p className="text-base font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm text-muted">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
