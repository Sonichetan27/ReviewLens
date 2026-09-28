import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import PlaceCard from '../components/common/PlaceCard.jsx';
import { EmptyState, ErrorState } from '../components/common/States.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { usePlaces } from '../hooks/usePlaces.js';
import { getDestinations } from '../services/api.js';

function Home() {
  const { preferences, setPreferences } = usePreferences();
  const destinations = useAsync(getDestinations, []);
  const featured = usePlaces({ city: preferences.destination });

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white px-5 py-8 shadow-card md:px-10 md:py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Review intelligence</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-ink md:text-5xl">
          Find what fits you, verified by authentic reviews.
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted">
          Skip generic star averages. ReviewLens extracts aspect scores, a Review Trust Signal, and a match that
          follows your priorities.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/preferences">
            <Button>Find My Perfect Place</Button>
          </Link>
          <Link to="/explore">
            <Button variant="secondary">Browse places</Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-ink">Jump to a city</h2>
        {destinations.isLoading ? (
          <LoadingSkeleton variant="row" />
        ) : destinations.error ? (
          <ErrorState message={destinations.error} />
        ) : (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {(destinations.data || []).map((item) => (
              <button
                key={item.city}
                type="button"
                onClick={() => setPreferences({ destination: item.city })}
                className={`touch-target shrink-0 rounded-2xl border px-4 text-sm font-semibold ${
                  preferences.destination === item.city
                    ? 'border-accent bg-teal-50 text-accent'
                    : 'border-line bg-white text-ink'
                }`}
              >
                {item.city}
                <span className="ml-2 text-xs text-muted">{item.placeCount}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold text-ink">Top rated in {preferences.destination}</h2>
          <Link to="/explore" className="text-sm font-semibold text-accent">
            See all
          </Link>
        </div>
        {featured.isLoading ? (
          <LoadingSkeleton count={3} />
        ) : featured.error ? (
          <ErrorState message={featured.error} />
        ) : !(featured.data || []).length ? (
          <EmptyState title="No places yet" body="Seed the database or pick another city." />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(featured.data || []).slice(0, 6).map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
