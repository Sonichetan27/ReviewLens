import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';
import StarRating from '../common/StarRating.jsx';
import TrustBadge from '../common/TrustBadge.jsx';
import { PRICE_LABELS, categoryLabel, topAspects } from '../../utils/constants.js';

function RecommendationCard({ item, onWhy }) {
  const { place, finalScore } = item;
  const highlights = topAspects(place, 2);

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <img src={place.imageUrl} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                {categoryLabel(place.category)} · {PRICE_LABELS[place.priceLevel]}
              </p>
              <h3 className="text-lg font-bold text-ink">{place.name}</h3>
            </div>
            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-sm font-black text-accent">
              {Math.round(finalScore)}%
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StarRating value={place.overallRating} />
            <TrustBadge score={place.aggregateScores?.trustScore} />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {highlights.map((aspect) => (
              <span key={aspect.key} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-ink">
                {aspect.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button className="flex-1" variant="secondary" onClick={onWhy}>
          Why recommended?
        </Button>
        <Link to={`/places/${place._id}`} className="flex-1">
          <Button className="w-full">Open place</Button>
        </Link>
      </div>
    </Card>
  );
}

export default RecommendationCard;
