import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/explore', label: 'Explore', icon: '⌕' },
  { to: '/recommendations', label: 'Matches', icon: '★' },
  { to: '/intelligence', label: 'Insights', icon: '◎' },
];

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex min-h-[56px] flex-col items-center justify-center text-[11px] font-semibold ${
                isActive ? 'text-accent' : 'text-muted'
              }`
            }
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
