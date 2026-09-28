import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/preferences', label: 'Preferences' },
  { to: '/recommendations', label: 'Matches' },
  { to: '/intelligence', label: 'Insights' },
];

function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <NavLink to="/" className="touch-target flex items-center gap-2 font-black tracking-tight text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm text-white">RL</span>
          ReviewLens
        </NavLink>
        <nav className="hidden md:flex justify-between gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `touch-target rounded-xl px-3 text-sm font-semibold ${
                  isActive ? 'bg-teal-50 text-accent' : 'text-muted hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default TopNav;
