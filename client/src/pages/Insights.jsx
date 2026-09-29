import PlaceCard from '../components/common/PlaceCard.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import { EmptyState, ErrorState } from '../components/common/States.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { usePlaces } from '../hooks/usePlaces.js';

/**
 * Insights.jsx — landing page for the bottom-nav "Insights" tab.
 * There is no single place's intelligence to show without first picking a place,
 * so this reuses the saved preferences (destination/placeType) to shortlist places,
 * then links each into /places/:id/intelligence (ReviewIntelligence.jsx).
 */
function Insights() {
  const { preferences } = usePreferences();
  const places = usePlaces({ city: preferences.destination, category: preferences.placeType });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-ink">Review Insights</h1>
        <p className="mt-1 text-sm text-muted">
          Pick a place to see its AI-analyzed aspect scores, sentiment and Review Trust Signal.
        </p>
      </div>

      {places.isLoading ? (
        <LoadingSkeleton count={3} />
      ) : places.error ? (
        <ErrorState message={places.error} />
      ) : !(places.data || []).length ? (
        <EmptyState
          title="No places found"
          body="Try changing your destination or place type in Preferences."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.data.map((place) => (
            <PlaceCard key={place._id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Insights;
