import { Link, useParams } from 'react-router-dom';
import AspectBar from '../components/common/AspectBar.jsx';
import Card from '../components/common/Card.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import { EmptyState, ErrorState } from '../components/common/States.jsx';
import TrustBadge from '../components/common/TrustBadge.jsx';
import { usePlaceDetails, usePlaceIntelligence } from '../hooks/usePlaces.js';
import { ASPECTS } from '../utils/constants.js';

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-surface px-3 py-3 text-center">
      <p className="text-2xl font-black text-ink">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function EvidenceList({ title, items, tone }) {
  return (
    <Card className="space-y-2 p-4">
      <h3 className={`text-sm font-bold ${tone}`}>{title}</h3>
      {items?.length ? (
        <ul className="space-y-2">
          {items.map((text, i) => (
            <li key={`${i}-${text}`} className="break-words rounded-lg bg-surface px-3 py-2 text-sm text-ink">
              {text}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No evidence extracted.</p>
      )}
    </Card>
  );
}

function ReviewIntelligence() {
  const { id } = useParams();
  const place = usePlaceDetails(id);
  const intel = usePlaceIntelligence(id);

  if (place.isLoading || intel.isLoading) return <LoadingSkeleton count={2} />;
  if (place.error || intel.error) return <ErrorState message={place.error || intel.error} />;
  if (!place.data || !intel.data) {
    return <EmptyState title="No intelligence yet" body="This place has no analyzed reviews." />;
  }

  const p = place.data;
  const d = intel.data;
  const aspects = p.aggregateScores?.aspects || {};
  const s = d.sentimentSummary || {};
  const t = d.trustDistribution || {};

  return (
    <div className="space-y-6">
      <Link to={`/places/${p._id}`} className="inline-block text-sm font-semibold text-accent">
        ← Back to {p.name}
      </Link>
      <div>
        <h1 className="text-2xl font-black text-ink">Review intelligence</h1>
        <p className="mt-1 text-sm text-muted">
          Language analysis of {p.name} reviews. Scores are computed by the ReviewLens backend.
        </p>
      </div>

      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-ink">Review Trust Signal</h2>
          <TrustBadge score={d.trustScore} />
        </div>
        <p className="text-sm text-muted">
          A heuristic indicator, not a verdict. Reviews are never removed automatically.
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Higher-trust" value={t.higherTrust ?? 0} />
          <Stat label="Medium" value={t.medium ?? 0} />
          <Stat label="High-risk" value={t.highRisk ?? 0} />
        </div>
      </Card>

      <Card className="space-y-3 p-4">
        <h2 className="text-lg font-bold text-ink">Sentiment</h2>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Positive" value={s.positiveCount ?? 0} />
          <Stat label="Neutral" value={s.neutralCount ?? 0} />
          <Stat label="Negative" value={s.negativeCount ?? 0} />
        </div>
      </Card>

      <Card className="space-y-4 p-4">
        <h2 className="text-lg font-bold text-ink">Aspect scores</h2>
        {ASPECTS.map((a) => (
          <AspectBar
            key={a.key}
            label={`${a.label} (${aspects[a.key]?.mentionCount ?? 0} mentions)`}
            score={aspects[a.key]?.avgScore}
          />
        ))}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <EvidenceList title="Positive evidence" items={d.positiveEvidence} tone="text-trust-high" />
        <EvidenceList title="Negative evidence" items={d.negativeEvidence} tone="text-trust-risk" />
      </div>
    </div>
  );
}

export default ReviewIntelligence;
