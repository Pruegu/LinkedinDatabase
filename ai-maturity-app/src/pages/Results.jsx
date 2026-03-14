import { useState } from 'react';
import { dimensions, maturityLevels } from '../data/questions';
import { recommendations } from '../data/recommendations';
import RadarChart from '../components/RadarChart';
import MaturityBadge from '../components/MaturityBadge';

export default function Results({ scores, onRestart }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedDim, setExpandedDim] = useState(null);

  const overallScore = Math.round(
    dimensions.reduce((acc, d) => acc + (scores[d.id] || 0), 0) / dimensions.length
  );
  const overallLevel = maturityLevels.find((m) => m.level === overallScore);

  const handleExportPDF = () => {
    window.print();
  };

  const tabs = [
    { id: 'overview', label: 'Übersicht' },
    { id: 'recommendations', label: 'Handlungsempfehlungen' },
    { id: 'okrs', label: 'OKRs' },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white py-6 px-6 no-print">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Ergebnis: KI-Reifegrad</h1>
            <p className="opacity-75 text-sm mt-1">Ihre individuelle Auswertung</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
            >
              Als PDF drucken
            </button>
            <button
              onClick={onRestart}
              className="bg-accent hover:bg-accent-light text-primary-dark px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer"
            >
              Neu starten
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Overall Score */}
        <div className="bg-card rounded-2xl p-8 shadow-sm mb-8 text-center">
          <h2 className="text-lg font-semibold text-text-light mb-4">Gesamtreifegrad</h2>
          <div className="mb-4">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-full text-white text-3xl font-bold shadow-lg"
              style={{ backgroundColor: overallLevel?.color }}
            >
              {overallScore}
            </div>
          </div>
          <MaturityBadge level={overallScore} size="xl" />
          <p className="text-text-light mt-4 max-w-xl mx-auto">
            {overallLevel?.description}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 p-1 rounded-xl mb-8 no-print">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab scores={scores} overallScore={overallScore} />
        )}
        {activeTab === 'recommendations' && (
          <RecommendationsTab scores={scores} expandedDim={expandedDim} setExpandedDim={setExpandedDim} />
        )}
        {activeTab === 'okrs' && (
          <OKRsTab scores={scores} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark text-white/60 text-center py-6 text-sm mt-12">
        <p>KI-Reifegradmodell für die Öffentliche Verwaltung</p>
      </footer>
    </div>
  );
}

function OverviewTab({ scores, overallScore }) {
  return (
    <div className="space-y-8">
      {/* Radar Chart */}
      <div className="bg-card rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-center mb-6">Reifegradprofil</h3>
        <RadarChart scores={scores} />
      </div>

      {/* Dimension Details */}
      <div className="bg-card rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-6">Ergebnisse nach Dimension</h3>
        <div className="space-y-4">
          {dimensions.map((dim) => {
            const score = scores[dim.id] || 0;
            const level = maturityLevels.find((m) => m.level === score);
            const percentage = (score / 5) * 100;

            return (
              <div key={dim.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{dim.icon}</span>
                    <span className="font-bold">{dim.name}</span>
                  </div>
                  <MaturityBadge level={score} size="sm" />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: level?.color,
                    }}
                  />
                </div>
                <p className="text-xs text-text-light mt-2">{level?.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <h3 className="font-bold text-green-800 mb-4">Stärken</h3>
          {dimensions
            .filter((d) => scores[d.id] >= overallScore)
            .sort((a, b) => scores[b.id] - scores[a.id])
            .map((dim) => (
              <div key={dim.id} className="flex items-center gap-2 py-1.5">
                <span>{dim.icon}</span>
                <span className="text-sm font-medium">{dim.name}</span>
                <span className="ml-auto text-sm text-green-700 font-bold">
                  {scores[dim.id]}/5
                </span>
              </div>
            ))}
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <h3 className="font-bold text-orange-800 mb-4">Handlungsbedarf</h3>
          {dimensions
            .filter((d) => scores[d.id] < overallScore)
            .sort((a, b) => scores[a.id] - scores[b.id])
            .map((dim) => (
              <div key={dim.id} className="flex items-center gap-2 py-1.5">
                <span>{dim.icon}</span>
                <span className="text-sm font-medium">{dim.name}</span>
                <span className="ml-auto text-sm text-orange-700 font-bold">
                  {scores[dim.id]}/5
                </span>
              </div>
            ))}
          {dimensions.filter((d) => scores[d.id] < overallScore).length === 0 && (
            <p className="text-sm text-orange-600">
              Alle Dimensionen liegen auf oder über dem Durchschnitt.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function RecommendationsTab({ scores, expandedDim, setExpandedDim }) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">
          Die Handlungsempfehlungen sind auf Ihren aktuellen Reifegrad in jeder Dimension
          zugeschnitten und zeigen konkrete nächste Schritte für die Weiterentwicklung.
        </p>
      </div>

      {dimensions.map((dim) => {
        const score = scores[dim.id] || 1;
        const rec = recommendations[dim.id]?.[score];
        if (!rec) return null;

        const isExpanded = expandedDim === dim.id;

        return (
          <div
            key={dim.id}
            className="bg-card rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => setExpandedDim(isExpanded ? null : dim.id)}
              className="w-full text-left p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{dim.icon}</span>
                <div>
                  <h3 className="font-bold" style={{ color: dim.color }}>
                    {dim.name}
                  </h3>
                  <p className="text-sm text-text-light">{rec.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MaturityBadge level={score} size="sm" />
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-text-light">
                  Empfohlene Maßnahmen
                </h4>
                <ul className="space-y-2">
                  {rec.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                        style={{ backgroundColor: dim.color }}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-sm">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function OKRsTab({ scores }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">
          Diese OKRs (Objectives & Key Results) sind auf Ihren aktuellen Reifegrad
          zugeschnitten und können als Ausgangspunkt für Ihre KI-Roadmap dienen.
          Passen Sie die Zeitrahmen an Ihre organisatorischen Gegebenheiten an.
        </p>
      </div>

      {dimensions.map((dim) => {
        const score = scores[dim.id] || 1;
        const rec = recommendations[dim.id]?.[score];
        if (!rec) return null;

        return (
          <div key={dim.id} className="bg-card rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{dim.icon}</span>
              <div>
                <h3 className="font-bold" style={{ color: dim.color }}>
                  {dim.name}
                </h3>
                <MaturityBadge level={score} size="sm" />
              </div>
            </div>

            {rec.okrs.map((okr, okrIdx) => (
              <div key={okrIdx} className="mt-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-bold text-base mb-1">
                    <span className="text-primary">Objective:</span>
                  </h4>
                  <p className="text-sm mb-4 font-medium">{okr.objective}</p>

                  <h4 className="font-bold text-sm mb-2">
                    <span className="text-primary">Key Results:</span>
                  </h4>
                  <ul className="space-y-2">
                    {okr.keyResults.map((kr, krIdx) => (
                      <li key={krIdx} className="flex items-start gap-2">
                        <span className="text-success font-bold mt-0.5">KR{krIdx + 1}</span>
                        <span className="text-sm">{kr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
