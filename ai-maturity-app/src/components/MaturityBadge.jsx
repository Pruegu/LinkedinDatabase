import { maturityLevels } from '../data/questions';

export default function MaturityBadge({ level, size = 'md' }) {
  const maturity = maturityLevels.find((m) => m.level === level);
  if (!maturity) return null;

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
    xl: 'text-lg px-6 py-3',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold text-white ${sizes[size]}`}
      style={{ backgroundColor: maturity.color }}
    >
      Level {maturity.level}: {maturity.name}
    </span>
  );
}
