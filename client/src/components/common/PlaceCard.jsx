import { Link } from 'react-router-dom';
import { PRICE_LABELS, categoryLabel, topAspects } from '../../utils/constants.js';
import Card from './Card.jsx';
import StarRating from './StarRating.jsx';
import TrustBadge from './TrustBadge.jsx';

function PlaceCard({ place }) {
  const highlights = topAspects(place, 2);

  return (
    <Card as={Link} to={`/places/${place._id}`} className="block transition hover:-translate-y-0.5 hover:shadow-md">
      <img src={place.imageUrl} alt="" className="h-40 w-full object-cover" />
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {categoryLabel(place.category)} · {PRICE_LABELS[place.priceLevel]}
            </p>
            <h3 className="mt-1 text-lg font-bold leading-tight text-ink">{place.name}</h3>
            <p className="text-sm text-muted">{place.city}</p>
          </div>
          <TrustBadge score={place.aggregateScores?.trustScore} />
        </div>
        <div className="flex items-center justify-between">
          <StarRating value={place.overallRating} />
          <span className="text-xs text-muted">{place.reviewCount || 0} reviews</span>
        </div>
        {highlights.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {highlights.map((aspect) => (
              <span key={aspect.key} className="rounded-full bg-teal-50 px-2 py-1 text-xs font-semibold text-accent">
                {aspect.label} {Math.round(aspect.avgScore)}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export default PlaceCard;
