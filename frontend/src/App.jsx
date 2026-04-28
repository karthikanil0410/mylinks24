import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CampaignPage from './pages/CampaignPage';
import Dashboard from './pages/Dashboard';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/c/:slug" element={<CampaignPage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;