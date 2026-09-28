import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import Preferences from './pages/Preferences.jsx';
import Recommendations from './pages/Recommendations.jsx';
import PlaceDetails from './pages/PlaceDetails.jsx';
import ReviewIntelligence from './pages/ReviewIntelligence.jsx';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/places/:id" element={<PlaceDetails />} />
        <Route path="/places/:id/intelligence" element={<ReviewIntelligence />} />
      </Route>
    </Routes>
  );
}

export default App;
