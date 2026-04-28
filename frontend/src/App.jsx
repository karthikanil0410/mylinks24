import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CampaignPage from './pages/CampaignPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/c/:slug" element={<CampaignPage />} />
      </Routes>
    </Router>
  );
}

export default App;