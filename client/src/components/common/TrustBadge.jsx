import { trustLabel, trustLevelFromScore } from '../../utils/constants.js';

const STYLES = {
  'higher-trust': 'bg-emerald-50 text-trust-high',
  medium: 'bg-amber-50 text-trust-medium',
  'high-risk': 'bg-rose-50 text-trust-risk',
};

function TrustBadge({ score, level }) {
  const resolved = level || trustLevelFromScore(score ?? 0);
  return (
    <span className={`inline-flex min-h-[28px] items-center rounded-full px-2.5 text-xs font-semibold ${STYLES[resolved]}`}>
      {trustLabel(resolved)}
    </span>
  );
}

export default TrustBadge;
