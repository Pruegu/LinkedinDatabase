import { dimensions } from '../data/questions';

export default function ProgressBar({ currentDimension, answeredQuestions, totalQuestions }) {
  const currentIndex = dimensions.findIndex((d) => d.id === currentDimension);
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-text-light">
          Fortschritt: {answeredQuestions} von {totalQuestions} Fragen
        </span>
        <span className="text-sm font-semibold text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #1e3a5f, #2d5a8e, #0ea5e9)',
          }}
        />
      </div>
      <div className="flex justify-between mt-3 gap-1">
        {dimensions.map((dim, idx) => (
          <div
            key={dim.id}
            className={`flex-1 text-center text-xs py-1.5 px-0.5 rounded transition-all ${
              idx === currentIndex
                ? 'bg-primary text-white font-bold'
                : idx < currentIndex
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <span className="hidden sm:inline">{dim.icon} {dim.name}</span>
            <span className="sm:hidden">{dim.icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
