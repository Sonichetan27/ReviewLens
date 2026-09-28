import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import { EmptyState, ErrorState } from '../components/common/States.jsx';
import RecommendationCard from '../components/recommendations/RecommendationCard.jsx';
import WhyRecommendedPanel from '../components/recommendations/WhyRecommendedPanel.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { useRecommendations } from '../hooks/usePlaces.js';
import { PLACE_TYPES } from '../utils/constants.js';

function Recommendations() {
  const { preferences } = usePreferences();
  const { data, error, isLoading } = useRecommendations(preferences);
  const [selected, setSelected] = useState(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-black text-ink">Your matches</h1>
          <p className="mt-1 text-sm text-muted">
            {PLACE_TYPES.find((t) => t.id === preferences.placeType)?.label} in {preferences.destination} · {preferences.budget} budget
          </p>
          <Link to="/preferences" className="mt-2 inline-block text-sm font-semibold text-accent">
            Edit preferences
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton count={3} />
        ) : error ? (
          <ErrorState message={error} />
        ) : !(data || []).length ? (
          <EmptyState
            title="No matches yet"
            body="Try another city or place type."
            action={
              <Link to="/preferences">
                <Button>Adjust preferences</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {data.map((item) => (
              <RecommendationCard
                key={item.place._id}
                item={item}
                onWhy={() => setSelected(item)}
              />
            ))}
          </div>
        )}
      </div>
      <WhyRecommendedPanel item={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
}

export default Recommendations;
