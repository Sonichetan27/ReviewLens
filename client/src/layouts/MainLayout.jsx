import { Outlet } from 'react-router-dom';
import TopNav from '../components/navigation/TopNav.jsx';
import BottomNav from '../components/navigation/BottomNav.jsx';

function MainLayout() {
  return (
    <div>
      <TopNav />
      <Outlet />
      <BottomNav />
    </div>
  );
}

export default MainLayout;
