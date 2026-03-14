import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { dimensions } from '../data/questions';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ scores }) {
  const data = {
    labels: dimensions.map((d) => d.name),
    datasets: [
      {
        label: 'KI-Reifegrad',
        data: dimensions.map((d) => scores[d.id] || 0),
        backgroundColor: 'rgba(30, 58, 95, 0.2)',
        borderColor: '#1e3a5f',
        borderWidth: 2,
        pointBackgroundColor: dimensions.map((d) => d.color),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          font: { size: 11 },
          backdropColor: 'transparent',
          callback: (value) => {
            const labels = ['', 'Initial', 'Erkundet', 'Definiert', 'Gesteuert', 'Optimiert'];
            return labels[value] || '';
          },
        },
        pointLabels: {
          font: { size: 13, weight: 'bold' },
          color: '#1a1a2e',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.08)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.08)',
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const labels = ['', 'Initial', 'Erkundet', 'Definiert', 'Gesteuert', 'Optimiert'];
            return `${context.label}: ${labels[context.raw]} (${context.raw}/5)`;
          },
        },
      },
    },
  };

  return (
    <div className="radar-container">
      <Radar data={data} options={options} />
    </div>
  );
}
