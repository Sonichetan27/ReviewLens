import { Link, useParams } from 'react-router-dom';
import AspectBar from '../components/common/AspectBar.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import StarRating from '../components/common/StarRating.jsx';
import { EmptyState, ErrorState } from '../components/common/States.jsx';
import TrustBadge from '../components/common/TrustBadge.jsx';
import { usePlaceDetails, usePlaceReviews } from '../hooks/usePlaces.js';
import { ASPECTS, PRICE_LABELS, categoryLabel } from '../utils/constants.js';

function PlaceDetails() {
  const { id } = useParams();
  const place = usePlaceDetails(id);
  const reviews = usePlaceReviews(id);

  if (place.isLoading) return <LoadingSkeleton count={2} />;
  if (place.error) return <ErrorState message={place.error} />;
  if (!place.data) {
    return <EmptyState title="Place not found" body="This place may have been removed." />;
  }

  const p = place.data;
  const agg = p.aggregateScores || {};
  const aspects = agg.aspects || {};
  const scored = ASPECTS.filter((a) => aspects[a.key]?.avgScore != null);

  return (
    <div className="space-y-6">
      <Link to="/recommendations" className="inline-block text-sm font-semibold text-accent">
        ← Back to matches
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <img
          src={p.imageUrl}
          alt={p.name}
          loading="lazy"
          className="h-56 w-full rounded-2xl object-cover md:h-72"
        />
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase text-muted">
            {categoryLabel(p.category)} · {PRICE_LABELS[p.priceLevel]} · {p.city}
          </p>
          <h1 className="text-2xl font-black text-ink">{p.name}</h1>
          <p className="text-sm text-muted">{p.address}</p>
          <div className="flex flex-wrap items-center gap-3">
            <StarRating value={p.overallRating} />
            <TrustBadge score={agg.trustScore} />
            <span className="text-sm text-muted">{p.reviewCount || 0} reviews analyzed</span>
          </div>
          <Link to={`/places/${p._id}/intelligence`} className="block">
            <Button className="w-full md:w-auto">Open review intelligence</Button>
          </Link>
        </div>
      </div>

      <Card className="space-y-4 p-4">
        <h2 className="text-lg font-bold text-ink">Aspect scores from reviews</h2>
        {scored.length ? (
          scored.map((a) => (
            <AspectBar
              key={a.key}
              label={`${a.label} (${aspects[a.key].mentionCount} mentions)`}
              score={aspects[a.key].avgScore}
            />
          ))
        ) : (
          <p className="text-sm text-muted">Not enough analyzed reviews yet.</p>
        )}
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">Recent reviews</h2>
        {reviews.isLoading ? (
          <LoadingSkeleton count={2} />
        ) : reviews.error ? (
          <ErrorState message={reviews.error} />
        ) : !(reviews.data || []).length ? (
          <EmptyState title="No reviews yet" body="Be the first to review this place." />
        ) : (
          reviews.data.slice(0, 8).map((r) => (
            <Card key={r._id} className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink">{r.authorName}</span>
                <StarRating value={r.rating} />
              </div>
              <p className="break-words text-sm text-ink">{r.text}</p>
              {r.analysis?.trustSignal ? (
                <div className="space-y-1">
                  <TrustBadge level={r.analysis.trustSignal.level} />
                  <p className="text-xs text-muted">{r.analysis.trustSignal.reasons?.[0]}</p>
                </div>
              ) : null}
            </Card>
          ))
        )}
      </section>
    </div>
  );
}

export default PlaceDetails;
