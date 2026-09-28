import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { ASPECTS, BUDGETS, CITIES, PLACE_TYPES, VISIT_TYPES } from '../utils/constants.js';

function Preferences() {
  const { preferences, setPreferences } = usePreferences();
  const navigate = useNavigate();

  const setPriority = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      priorities: { ...prev.priorities, [key]: Number(value) },
    }));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ink">Your preferences</h1>
        <p className="mt-1 text-sm text-muted">These weights drive the 40/20/15/15/10 match score.</p>
      </div>

      <Field label="Destination">
        <select
          className="w-full rounded-xl border border-line bg-white px-3 py-3"
          value={preferences.destination}
          onChange={(e) => setPreferences({ destination: e.target.value })}
        >
          {CITIES.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </Field>

      <Field label="Place type">
        <div className="grid grid-cols-2 gap-2">
          {PLACE_TYPES.map((item) => (
            <Choice
              key={item.id}
              active={preferences.placeType === item.id}
              onClick={() => setPreferences({ placeType: item.id })}
            >
              {item.label}
            </Choice>
          ))}
        </div>
      </Field>

      <Field label="Budget">
        <div className="grid grid-cols-3 gap-2">
          {BUDGETS.map((item) => (
            <Choice
              key={item.id}
              active={preferences.budget === item.id}
              onClick={() => setPreferences({ budget: item.id })}
            >
              {item.label}
            </Choice>
          ))}
        </div>
      </Field>

      <Field label="Visit type">
        <div className="flex flex-wrap gap-2">
          {VISIT_TYPES.map((item) => (
            <Choice
              key={item.id}
              active={preferences.visitType === item.id}
              onClick={() => setPreferences({ visitType: item.id })}
            >
              {item.label}
            </Choice>
          ))}
        </div>
      </Field>

      <Field label="Aspect priorities">
        <div className="space-y-4">
          {ASPECTS.map((aspect) => (
            <label key={aspect.key} className="block">
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-semibold text-ink">{aspect.label}</span>
                <span className="text-muted">{preferences.priorities[aspect.key]}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                className="aspect-slider-horizontal"
                value={preferences.priorities[aspect.key]}
                onChange={(e) => setPriority(aspect.key, e.target.value)}
              />
            </label>
          ))}
        </div>
      </Field>

      <Button className="w-full" onClick={() => navigate('/recommendations')}>
        Show my matches
      </Button>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">{label}</h2>
      {children}
    </section>
  );
}

function Choice({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`touch-target rounded-xl border px-3 text-sm font-semibold ${
        active ? 'border-accent bg-teal-50 text-accent' : 'border-line bg-white text-ink'
      }`}
    >
      {children}
    </button>
  );
}

export default Preferences;
