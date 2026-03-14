import { useState } from 'react';
import { dimensions, questions } from '../data/questions';
import ProgressBar from '../components/ProgressBar';

export default function Assessment({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [currentDimIdx, setCurrentDimIdx] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);

  const allQuestionsList = dimensions.flatMap((d) =>
    questions[d.id].map((q) => ({ ...q, dimensionId: d.id }))
  );
  const totalQuestions = allQuestionsList.length;
  const answeredCount = Object.keys(answers).length;

  const currentDim = dimensions[currentDimIdx];
  const dimQuestions = questions[currentDim.id];
  const currentQuestion = dimQuestions[currentQIdx];
  const selectedValue = answers[currentQuestion.id];

  const handleSelect = (value) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQIdx < dimQuestions.length - 1) {
        setCurrentQIdx(currentQIdx + 1);
      } else if (currentDimIdx < dimensions.length - 1) {
        setCurrentDimIdx(currentDimIdx + 1);
        setCurrentQIdx(0);
      } else {
        // All questions answered - calculate scores
        const scores = {};
        dimensions.forEach((dim) => {
          const dimQs = questions[dim.id];
          const sum = dimQs.reduce((acc, q) => acc + (newAnswers[q.id] || 0), 0);
          scores[dim.id] = Math.round(sum / dimQs.length);
        });
        onComplete(scores, newAnswers);
      }
    }, 300);
  };

  const goBack = () => {
    if (currentQIdx > 0) {
      setCurrentQIdx(currentQIdx - 1);
    } else if (currentDimIdx > 0) {
      setCurrentDimIdx(currentDimIdx - 1);
      setCurrentQIdx(questions[dimensions[currentDimIdx - 1].id].length - 1);
    }
  };

  const canGoBack = currentDimIdx > 0 || currentQIdx > 0;
  const globalQIdx = dimensions.slice(0, currentDimIdx).reduce(
    (acc, d) => acc + questions[d.id].length, 0
  ) + currentQIdx + 1;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-primary text-white py-4 px-6 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">KI-Reifegrad Assessment</h1>
          <span className="text-sm opacity-75">
            Frage {globalQIdx} von {totalQuestions}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <ProgressBar
          currentDimension={currentDim.id}
          answeredQuestions={answeredCount}
          totalQuestions={totalQuestions}
        />

        {/* Dimension Header */}
        <div
          className="bg-card rounded-xl p-5 mb-6 shadow-sm border-l-4"
          style={{ borderLeftColor: currentDim.color }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentDim.icon}</span>
            <div>
              <h2 className="text-xl font-bold" style={{ color: currentDim.color }}>
                {currentDim.name}
              </h2>
              <p className="text-sm text-text-light">
                Frage {currentQIdx + 1} von {dimQuestions.length}
              </p>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-card rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-6">{currentQuestion.text}</h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedValue === option.value
                    ? 'border-primary bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      selectedValue === option.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {option.value}
                  </div>
                  <span className={`text-sm ${selectedValue === option.value ? 'font-medium' : ''}`}>
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              canGoBack
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Zurück
          </button>
          {selectedValue && (
            <button
              onClick={() => handleSelect(selectedValue)}
              className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-all"
            >
              {currentDimIdx === dimensions.length - 1 && currentQIdx === dimQuestions.length - 1
                ? 'Auswertung anzeigen'
                : 'Weiter'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
