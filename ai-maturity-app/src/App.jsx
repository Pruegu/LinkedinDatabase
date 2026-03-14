import { useState } from 'react';
import Welcome from './pages/Welcome';
import Assessment from './pages/Assessment';
import Results from './pages/Results';

function App() {
  const [page, setPage] = useState('welcome');
  const [scores, setScores] = useState(null);

  const handleStart = () => setPage('assessment');

  const handleComplete = (calculatedScores) => {
    setScores(calculatedScores);
    setPage('results');
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setScores(null);
    setPage('welcome');
    window.scrollTo(0, 0);
  };

  if (page === 'welcome') return <Welcome onStart={handleStart} />;
  if (page === 'assessment') return <Assessment onComplete={handleComplete} />;
  if (page === 'results') return <Results scores={scores} onRestart={handleRestart} />;

  return null;
}

export default App;
