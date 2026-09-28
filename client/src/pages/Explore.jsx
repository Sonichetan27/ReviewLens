import { useMemo, useState } from 'react';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import PlaceCard from '../components/common/PlaceCard.jsx';
import { EmptyState, ErrorState } from '../components/common/States.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { usePlaces } from '../hooks/usePlaces.js';
import { BUDGETS, CITIES, PLACE_TYPES } from '../utils/constants.js';

function Explore() {
  const { preferences } = usePreferences();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState(preferences.destination || '');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');

  const filters = useMemo(() => ({ city, category, search, budget }), [city, category, search, budget]);
  const { data, error, isLoading } = usePlaces(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink">Explore</h1>
        <p className="mt-1 text-sm text-muted">Search by city, category, and budget.</p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, city, or address"
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip active={!city} onClick={() => setCity('')}>
          All cities
        </FilterChip>
        {CITIES.map((item) => (
          <FilterChip key={item} active={city === item} onClick={() => setCity(item)}>
            {item}
          </FilterChip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <FilterChip active={!category} onClick={() => setCategory('')}>
          All types
        </FilterChip>
        {PLACE_TYPES.map((item) => (
          <FilterChip key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>
            {item.label}
          </FilterChip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <FilterChip active={!budget} onClick={() => setBudget('')}>
          Any budget
        </FilterChip>
        {BUDGETS.map((item) => (
          <FilterChip key={item.id} active={budget === item.id} onClick={() => setBudget(item.id)}>
            {item.label}
          </FilterChip>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : error ? (
        <ErrorState message={error} />
      ) : !(data || []).length ? (
        <EmptyState title="No matches" body="Try a different city, category, or search term." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((place) => (
            <PlaceCard key={place._id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`touch-target rounded-full border px-3 text-sm font-semibold ${
        active ? 'border-accent bg-teal-50 text-accent' : 'border-line bg-white text-ink'
      }`}
    >
      {children}
    </button>
  );
}

export default Explore;
