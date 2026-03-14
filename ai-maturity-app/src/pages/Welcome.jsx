import { dimensions, maturityLevels } from '../data/questions';

export default function Welcome({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🏛️</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            KI-Reifegradmodell
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-2">
            Öffentliche Verwaltung
          </p>
          <p className="text-base opacity-75 max-w-2xl mx-auto mt-4">
            Ermitteln Sie den KI-Reifegrad Ihrer Organisation in 6 Dimensionen und erhalten
            Sie maßgeschneiderte Handlungsempfehlungen sowie konkrete OKRs für Ihren Weg
            zur KI-kompetenten Verwaltung.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12">
        {/* Dimensions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Die 6 Dimensionen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dimensions.map((dim) => (
              <div
                key={dim.id}
                className="bg-card rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-2">{dim.icon}</div>
                <h3 className="font-bold text-lg" style={{ color: dim.color }}>
                  {dim.name}
                </h3>
                <p className="text-sm text-text-light mt-1">
                  5 Fragen zur Einschätzung des Reifegrads
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Maturity Levels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Die 5 Reifegrade</h2>
          <div className="space-y-3">
            {maturityLevels.map((level) => (
              <div
                key={level.level}
                className="flex items-start gap-4 bg-card rounded-lg p-4 shadow-sm border border-gray-100"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ backgroundColor: level.color }}
                >
                  {level.level}
                </div>
                <div>
                  <h3 className="font-bold">{level.name}</h3>
                  <p className="text-sm text-text-light">{level.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info */}
        <section className="bg-blue-50 rounded-xl p-6 mb-12 border border-blue-100">
          <h3 className="font-bold text-lg mb-2 text-primary">So funktioniert es</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-text-light">
            <li>Beantworten Sie 30 Fragen in 6 Dimensionen (ca. 15-20 Minuten)</li>
            <li>Erhalten Sie eine visuelle Auswertung Ihres KI-Reifegrads</li>
            <li>Lesen Sie maßgeschneiderte Handlungsempfehlungen für jede Dimension</li>
            <li>Nutzen Sie die generierten OKRs als Basis für Ihre KI-Roadmap</li>
          </ol>
        </section>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={onStart}
            className="bg-primary hover:bg-primary-light text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
          >
            Assessment starten
          </button>
        </div>
      </main>
    </div>
  );
}
