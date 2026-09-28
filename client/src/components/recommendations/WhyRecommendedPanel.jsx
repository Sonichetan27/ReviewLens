import AspectBar from '../common/AspectBar.jsx';
import Button from '../common/Button.jsx';
import { ASPECTS } from '../../utils/constants.js';

function WhyRecommendedPanel({ item, open, onClose }) {
  if (!open || !item) return null;

  const { place, finalScore, breakdown, whyBullets } = item;
  const breakdownRows = [
    { key: 'aspectMatch', label: 'Aspect match', weight: '40%' },
    { key: 'contextMatch', label: 'Context / budget', weight: '20%' },
    { key: 'sentiment', label: 'Sentiment', weight: '15%' },
    { key: 'trustQuality', label: 'Trust-adjusted quality', weight: '15%' },
    { key: 'ratingScore', label: 'Star rating', weight: '10%' },
  ];

  return (
    <>
      <button type="button" className="fixed inset-0 z-40 bg-stone-900/40 md:hidden" onClick={onClose} aria-label="Close" />
      <aside className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-card md:sticky md:top-24 md:z-0 md:max-h-none md:rounded-2xl md:border md:border-line">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-stone-200 md:hidden" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Match for {place.name}</p>
            <p className="text-3xl font-black text-ink">{Math.round(finalScore)}/100</p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-ink">
          {(whyBullets || []).map((bullet) => (
            <li key={bullet} className="rounded-xl bg-surface px-3 py-2">
              {bullet}
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-3">
          {breakdownRows.map((row) => (
            <AspectBar
              key={row.key}
              label={`${row.label} (${row.weight})`}
              score={breakdown?.[row.key]}
            />
          ))}
        </div>
        <div className="mt-5 space-y-3">
          {ASPECTS.map((aspect) => (
            <AspectBar
              key={aspect.key}
              label={aspect.label}
              score={place.aggregateScores?.aspects?.[aspect.key]?.avgScore}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

export default WhyRecommendedPanel;
