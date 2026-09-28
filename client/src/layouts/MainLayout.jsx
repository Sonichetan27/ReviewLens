import { Outlet } from 'react-router-dom';
import TopNav from '../components/navigation/TopNav.jsx';
import BottomNav from '../components/navigation/BottomNav.jsx';

function MainLayout() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

export default MainLayout;
