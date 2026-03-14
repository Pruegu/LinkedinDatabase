export const dimensions = [
  { id: 'strategie', name: 'Strategie', icon: '🎯', color: '#1e3a5f' },
  { id: 'organisation', name: 'Organisation', icon: '🏛️', color: '#2d5a8e' },
  { id: 'technologie', name: 'Technologie', icon: '⚙️', color: '#0ea5e9' },
  { id: 'daten', name: 'Daten', icon: '📊', color: '#22c55e' },
  { id: 'menschen', name: 'Menschen', icon: '👥', color: '#e8a838' },
  { id: 'recht_ethik', name: 'Recht & Ethik', icon: '⚖️', color: '#9333ea' },
];

export const maturityLevels = [
  { level: 1, name: 'Initial', description: 'Kein systematischer Einsatz von KI. Einzelne Initiativen ohne Koordination.', color: '#ef4444' },
  { level: 2, name: 'Erkundet', description: 'Erste Pilotprojekte und explorative Ansätze. Bewusstsein wächst.', color: '#f97316' },
  { level: 3, name: 'Definiert', description: 'Strukturierte Prozesse und erste Standardisierung etabliert.', color: '#eab308' },
  { level: 4, name: 'Gesteuert', description: 'KI ist systematisch integriert und wird aktiv gemanagt.', color: '#22c55e' },
  { level: 5, name: 'Optimiert', description: 'Kontinuierliche Verbesserung und Vorreiterrolle bei KI-Einsatz.', color: '#0ea5e9' },
];

export const questions = {
  strategie: [
    {
      id: 's1',
      text: 'Existiert eine explizite KI-Strategie, die mit der Gesamtstrategie der Verwaltung verknüpft ist?',
      options: [
        { value: 1, label: 'Keine KI-Strategie vorhanden' },
        { value: 2, label: 'Erste Überlegungen, aber kein formales Dokument' },
        { value: 3, label: 'KI-Strategie ist dokumentiert, aber nicht vollständig umgesetzt' },
        { value: 4, label: 'KI-Strategie ist mit Gesamtstrategie verknüpft und wird umgesetzt' },
        { value: 5, label: 'KI-Strategie wird regelmäßig evaluiert und weiterentwickelt' },
      ],
    },
    {
      id: 's2',
      text: 'Wie werden KI-Anwendungsfälle identifiziert und priorisiert?',
      options: [
        { value: 1, label: 'Keine systematische Identifikation' },
        { value: 2, label: 'Ad-hoc durch einzelne Mitarbeitende' },
        { value: 3, label: 'Strukturierter Prozess mit definierten Kriterien' },
        { value: 4, label: 'Systematische Bewertung mit Kosten-Nutzen-Analyse' },
        { value: 5, label: 'Kontinuierliches Portfolio-Management mit Impact-Messung' },
      ],
    },
    {
      id: 's3',
      text: 'Gibt es definierte KPIs zur Messung des Erfolgs von KI-Initiativen?',
      options: [
        { value: 1, label: 'Keine KPIs definiert' },
        { value: 2, label: 'Vereinzelte Kennzahlen ohne systematische Erfassung' },
        { value: 3, label: 'KPIs definiert, aber unregelmäßig erhoben' },
        { value: 4, label: 'Regelmäßiges Reporting mit definierten KPIs' },
        { value: 5, label: 'Echtzeit-Dashboard mit automatisierter KPI-Erfassung' },
      ],
    },
    {
      id: 's4',
      text: 'Wie ist die Unterstützung der Führungsebene für KI-Vorhaben?',
      options: [
        { value: 1, label: 'Kein Interesse oder Unterstützung' },
        { value: 2, label: 'Passive Duldung einzelner Projekte' },
        { value: 3, label: 'Aktive Unterstützung durch einzelne Führungskräfte' },
        { value: 4, label: 'Breite Unterstützung der Führungsebene mit Budget' },
        { value: 5, label: 'KI ist Chefsache mit dedizierten Ressourcen und Governance' },
      ],
    },
    {
      id: 's5',
      text: 'Existiert eine Roadmap für die schrittweise KI-Einführung?',
      options: [
        { value: 1, label: 'Keine Roadmap vorhanden' },
        { value: 2, label: 'Grobe Vorstellungen, aber kein formaler Plan' },
        { value: 3, label: 'Roadmap existiert mit Meilensteinen für 1-2 Jahre' },
        { value: 4, label: 'Detaillierte Roadmap mit Abhängigkeiten und Ressourcenplanung' },
        { value: 5, label: 'Dynamische Roadmap mit regelmäßiger Anpassung und Stakeholder-Einbindung' },
      ],
    },
  ],
  organisation: [
    {
      id: 'o1',
      text: 'Gibt es eine dedizierte Organisationseinheit oder Rolle für KI?',
      options: [
        { value: 1, label: 'Keine dedizierte Zuständigkeit' },
        { value: 2, label: 'Einzelperson kümmert sich nebenbei um KI-Themen' },
        { value: 3, label: 'Arbeitsgruppe oder Projektteam für KI' },
        { value: 4, label: 'Dedizierte KI-Einheit mit klarem Mandat' },
        { value: 5, label: 'KI-Kompetenzzentrum mit bereichsübergreifender Steuerungsfunktion' },
      ],
    },
    {
      id: 'o2',
      text: 'Wie sind die Prozesse für KI-Projekte definiert (Entwicklung, Test, Deployment)?',
      options: [
        { value: 1, label: 'Keine definierten Prozesse' },
        { value: 2, label: 'Prozesse werden ad-hoc festgelegt' },
        { value: 3, label: 'Standardprozesse existieren, werden aber nicht durchgängig angewandt' },
        { value: 4, label: 'Etablierte Prozesse mit klaren Verantwortlichkeiten' },
        { value: 5, label: 'Agile, kontinuierlich optimierte Prozesse mit Automatisierung' },
      ],
    },
    {
      id: 'o3',
      text: 'Wie funktioniert die bereichsübergreifende Zusammenarbeit bei KI-Vorhaben?',
      options: [
        { value: 1, label: 'Keine bereichsübergreifende Zusammenarbeit' },
        { value: 2, label: 'Informelle Abstimmung bei Bedarf' },
        { value: 3, label: 'Regelmäßiger Austausch in definierten Gremien' },
        { value: 4, label: 'Strukturierte Zusammenarbeit mit gemeinsamen Projekten' },
        { value: 5, label: 'Integriertes Innovationsökosystem mit externen Partnern' },
      ],
    },
    {
      id: 'o4',
      text: 'Gibt es ein Change-Management für die KI-Einführung?',
      options: [
        { value: 1, label: 'Kein Change-Management vorhanden' },
        { value: 2, label: 'Reaktive Kommunikation bei Problemen' },
        { value: 3, label: 'Change-Management-Konzept existiert' },
        { value: 4, label: 'Systematisches Change-Management mit Beteiligungsformaten' },
        { value: 5, label: 'Proaktives Change-Management als integraler Bestandteil jedes KI-Projekts' },
      ],
    },
    {
      id: 'o5',
      text: 'Wie werden Erfahrungen aus KI-Projekten dokumentiert und geteilt?',
      options: [
        { value: 1, label: 'Keine Dokumentation oder Wissenstransfer' },
        { value: 2, label: 'Informeller Austausch zwischen Beteiligten' },
        { value: 3, label: 'Lessons Learned werden dokumentiert' },
        { value: 4, label: 'Wissensdatenbank mit Best Practices und Fallstudien' },
        { value: 5, label: 'Aktives Wissensmanagement mit Community of Practice' },
      ],
    },
  ],
  technologie: [
    {
      id: 't1',
      text: 'Wie ist die IT-Infrastruktur auf KI-Workloads vorbereitet?',
      options: [
        { value: 1, label: 'Keine geeignete Infrastruktur vorhanden' },
        { value: 2, label: 'Standardhardware, keine spezifische KI-Infrastruktur' },
        { value: 3, label: 'Erste Cloud- oder GPU-Ressourcen verfügbar' },
        { value: 4, label: 'Dedizierte KI-Plattform mit skalierbaren Ressourcen' },
        { value: 5, label: 'Hochverfügbare, skalierbare KI-Plattform mit MLOps-Pipeline' },
      ],
    },
    {
      id: 't2',
      text: 'Welche KI-Tools und -Frameworks werden eingesetzt?',
      options: [
        { value: 1, label: 'Keine KI-Tools im Einsatz' },
        { value: 2, label: 'Erste Experimente mit Standardtools (z.B. ChatGPT)' },
        { value: 3, label: 'Definierte Toollandschaft mit lizenzierten Produkten' },
        { value: 4, label: 'Integrierte KI-Plattform mit verschiedenen Frameworks' },
        { value: 5, label: 'Umfassendes KI-Ökosystem mit eigenen Modellen und APIs' },
      ],
    },
    {
      id: 't3',
      text: 'Wie werden KI-Modelle entwickelt, getestet und in Produktion gebracht?',
      options: [
        { value: 1, label: 'Kein strukturierter Prozess' },
        { value: 2, label: 'Manuelle Entwicklung und Einzeltests' },
        { value: 3, label: 'Definierte Entwicklungs- und Testumgebungen' },
        { value: 4, label: 'CI/CD-Pipeline für KI-Modelle mit automatisierten Tests' },
        { value: 5, label: 'Vollautomatisierte MLOps mit Monitoring und Auto-Retraining' },
      ],
    },
    {
      id: 't4',
      text: 'Wie ist die IT-Sicherheit im Kontext von KI-Anwendungen gewährleistet?',
      options: [
        { value: 1, label: 'Keine spezifischen Sicherheitsmaßnahmen für KI' },
        { value: 2, label: 'Allgemeine IT-Sicherheitsstandards angewandt' },
        { value: 3, label: 'KI-spezifische Sicherheitsrichtlinien definiert' },
        { value: 4, label: 'Regelmäßige Sicherheitsaudits für KI-Systeme' },
        { value: 5, label: 'Proaktives AI Security Management mit Red-Team-Tests' },
      ],
    },
    {
      id: 't5',
      text: 'Gibt es Schnittstellen (APIs) zur Integration von KI in bestehende Fachverfahren?',
      options: [
        { value: 1, label: 'Keine Schnittstellen vorhanden' },
        { value: 2, label: 'Erste manuelle Integrationsversuche' },
        { value: 3, label: 'Einzelne APIs für spezifische Anwendungen' },
        { value: 4, label: 'API-Management mit standardisierten Schnittstellen' },
        { value: 5, label: 'Vollständiges API-Ökosystem mit Self-Service-Portal' },
      ],
    },
  ],
  daten: [
    {
      id: 'd1',
      text: 'Wie ist die Datenqualität in Ihrer Organisation?',
      options: [
        { value: 1, label: 'Datenqualität ist unbekannt oder schlecht' },
        { value: 2, label: 'Vereinzelte Datenbereinigungen, keine Standards' },
        { value: 3, label: 'Datenqualitätsstandards definiert, teilweise umgesetzt' },
        { value: 4, label: 'Systematisches Datenqualitätsmanagement etabliert' },
        { value: 5, label: 'Automatisierte Datenqualitätssicherung mit kontinuierlichem Monitoring' },
      ],
    },
    {
      id: 'd2',
      text: 'Gibt es eine Data-Governance-Struktur?',
      options: [
        { value: 1, label: 'Keine Data Governance vorhanden' },
        { value: 2, label: 'Informelle Zuständigkeiten für einzelne Datenbereiche' },
        { value: 3, label: 'Data-Governance-Framework dokumentiert' },
        { value: 4, label: 'Aktive Data Governance mit Data Stewards und Katalog' },
        { value: 5, label: 'Unternehmensweite Data Governance als Teil der Kultur' },
      ],
    },
    {
      id: 'd3',
      text: 'Wie zugänglich sind die Daten für KI-Anwendungen?',
      options: [
        { value: 1, label: 'Daten sind in Silos und nicht zugänglich' },
        { value: 2, label: 'Zugang auf Anfrage, lange Wartezeiten' },
        { value: 3, label: 'Zentrale Datenspeicher mit definierten Zugriffsregeln' },
        { value: 4, label: 'Data Lake/Warehouse mit Self-Service-Zugang' },
        { value: 5, label: 'Echtzeit-Datenzugang mit automatisierter Datenanreicherung' },
      ],
    },
    {
      id: 'd4',
      text: 'Werden Open-Data-Prinzipien angewandt?',
      options: [
        { value: 1, label: 'Keine Open-Data-Aktivitäten' },
        { value: 2, label: 'Einzelne Datensätze werden bereitgestellt' },
        { value: 3, label: 'Open-Data-Strategie vorhanden, sukzessive Umsetzung' },
        { value: 4, label: 'Systematische Open-Data-Bereitstellung mit Qualitätsstandards' },
        { value: 5, label: 'Vorreiterrolle bei Open Data mit aktiver Community-Einbindung' },
      ],
    },
    {
      id: 'd5',
      text: 'Wie werden Trainingsdaten für KI-Modelle aufbereitet und verwaltet?',
      options: [
        { value: 1, label: 'Keine Erfahrung mit Trainingsdaten' },
        { value: 2, label: 'Manuelle, nicht reproduzierbare Aufbereitung' },
        { value: 3, label: 'Definierte Prozesse für Datenaufbereitung' },
        { value: 4, label: 'Automatisierte Datenpipelines mit Versionierung' },
        { value: 5, label: 'Feature Stores und automatisierte Labeling-Prozesse' },
      ],
    },
  ],
  menschen: [
    {
      id: 'm1',
      text: 'Wie hoch ist das allgemeine KI-Verständnis in der Organisation?',
      options: [
        { value: 1, label: 'Kaum Verständnis, viele Vorbehalte' },
        { value: 2, label: 'Grundlegendes Bewusstsein bei wenigen Mitarbeitenden' },
        { value: 3, label: 'Breites Grundverständnis, gezielte Vertiefung bei Schlüsselpersonen' },
        { value: 4, label: 'Gutes Verständnis auf allen Ebenen' },
        { value: 5, label: 'KI-Kompetenz ist Teil der Organisationskultur' },
      ],
    },
    {
      id: 'm2',
      text: 'Gibt es Weiterbildungsangebote im Bereich KI?',
      options: [
        { value: 1, label: 'Keine spezifischen Angebote' },
        { value: 2, label: 'Einzelne Informationsveranstaltungen' },
        { value: 3, label: 'Strukturiertes Schulungsprogramm mit verschiedenen Formaten' },
        { value: 4, label: 'Umfassendes Kompetenzentwicklungsprogramm mit Zertifizierungen' },
        { value: 5, label: 'Personalisierte Lernpfade mit Praxisprojekten und Mentoring' },
      ],
    },
    {
      id: 'm3',
      text: 'Wie wird mit Ängsten und Widerständen gegenüber KI umgegangen?',
      options: [
        { value: 1, label: 'Thema wird nicht adressiert' },
        { value: 2, label: 'Reaktive Kommunikation bei konkreten Bedenken' },
        { value: 3, label: 'Proaktive Kommunikationsstrategie vorhanden' },
        { value: 4, label: 'Beteiligungsformate und transparente Information' },
        { value: 5, label: 'Mitgestaltungsmöglichkeiten und positive KI-Erfahrungen als Norm' },
      ],
    },
    {
      id: 'm4',
      text: 'Gibt es ausreichend Fachpersonal für KI-Projekte?',
      options: [
        { value: 1, label: 'Kein Fachpersonal vorhanden' },
        { value: 2, label: 'Einzelne Mitarbeitende mit Grundkenntnissen' },
        { value: 3, label: 'Kleine KI-Fachgruppe, unterstützt durch externe Dienstleister' },
        { value: 4, label: 'Dediziertes KI-Team mit breitem Kompetenzprofil' },
        { value: 5, label: 'Attraktiver KI-Arbeitgeber mit starker Recruiting-Pipeline' },
      ],
    },
    {
      id: 'm5',
      text: 'Wie werden Mitarbeitende in die Entwicklung von KI-Anwendungen einbezogen?',
      options: [
        { value: 1, label: 'Keine Einbeziehung' },
        { value: 2, label: 'Information nach Fertigstellung' },
        { value: 3, label: 'Feedback wird in Testphasen eingeholt' },
        { value: 4, label: 'Co-Creation und nutzerzentrierte Entwicklung' },
        { value: 5, label: 'Citizen-Developer-Ansatz mit Low-Code/No-Code-Plattformen' },
      ],
    },
  ],
  recht_ethik: [
    {
      id: 'r1',
      text: 'Gibt es Richtlinien für den ethischen Einsatz von KI?',
      options: [
        { value: 1, label: 'Keine ethischen Richtlinien vorhanden' },
        { value: 2, label: 'Allgemeines Bewusstsein, keine formalen Richtlinien' },
        { value: 3, label: 'Ethik-Leitlinien dokumentiert' },
        { value: 4, label: 'Ethik-Framework mit Prüfverfahren implementiert' },
        { value: 5, label: 'Ethik-Board und kontinuierliches Impact-Assessment' },
      ],
    },
    {
      id: 'r2',
      text: 'Wie werden datenschutzrechtliche Anforderungen (DSGVO) bei KI-Projekten umgesetzt?',
      options: [
        { value: 1, label: 'Datenschutz wird nicht systematisch berücksichtigt' },
        { value: 2, label: 'Grundlegende DSGVO-Konformität, keine KI-spezifischen Maßnahmen' },
        { value: 3, label: 'Datenschutz-Folgenabschätzung für KI-Projekte durchgeführt' },
        { value: 4, label: 'Privacy-by-Design als Standard in allen KI-Projekten' },
        { value: 5, label: 'Proaktives Datenschutzmanagement mit automatisierter Compliance-Prüfung' },
      ],
    },
    {
      id: 'r3',
      text: 'Wie wird die Transparenz und Erklärbarkeit von KI-Entscheidungen sichergestellt?',
      options: [
        { value: 1, label: 'Keine Transparenzmaßnahmen' },
        { value: 2, label: 'Dokumentation auf Anfrage' },
        { value: 3, label: 'Grundlegende Dokumentation von KI-Entscheidungsprozessen' },
        { value: 4, label: 'Explainable-AI-Methoden im Einsatz' },
        { value: 5, label: 'Vollständige Nachvollziehbarkeit mit Audit-Trails und XAI-Dashboard' },
      ],
    },
    {
      id: 'r4',
      text: 'Wird die EU AI Act-Konformität systematisch geprüft?',
      options: [
        { value: 1, label: 'EU AI Act ist nicht bekannt' },
        { value: 2, label: 'Grundlegendes Wissen, aber keine Umsetzung' },
        { value: 3, label: 'Risikoklassifizierung der KI-Systeme durchgeführt' },
        { value: 4, label: 'Compliance-Prozess für alle KI-Systeme etabliert' },
        { value: 5, label: 'Vollständiges AI-Act-Compliance-Management-System' },
      ],
    },
    {
      id: 'r5',
      text: 'Wie wird Bias und Diskriminierung in KI-Systemen adressiert?',
      options: [
        { value: 1, label: 'Thema wird nicht berücksichtigt' },
        { value: 2, label: 'Bewusstsein vorhanden, keine systematischen Maßnahmen' },
        { value: 3, label: 'Bias-Checks in der Entwicklung vorgesehen' },
        { value: 4, label: 'Systematisches Fairness-Testing mit definierten Metriken' },
        { value: 5, label: 'Kontinuierliches Bias-Monitoring mit automatisierten Alerts' },
      ],
    },
  ],
};
