import { useState } from "react";

interface DataPoint {
  date: string;
  elo: number;
}

interface EloChartProps {
  dataPoints: DataPoint[];
}

const TIER_LINES = [
  { elo: 2000, label: "Ace" },
  { elo: 2500, label: "Veteran" },
  { elo: 2750, label: "Expert" },
  { elo: 3000, label: "Legend" },
];

export default function EloChart({ dataPoints }: EloChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (dataPoints.length === 0) return null;

  const padding = { top: 30, right: 80, bottom: 50, left: 60 };
  const width = 700;
  const height = 350;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const elos = dataPoints.map((d) => d.elo);
  const rawMin = Math.min(...elos);
  const rawMax = Math.max(...elos);

  // Include tier thresholds that fall within or near the data range
  const relevantTiers = TIER_LINES.filter(
    (t) => t.elo >= rawMin - 200 && t.elo <= rawMax + 200
  );
  const allValues = [...elos, ...relevantTiers.map((t) => t.elo)];

  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  const yPadding = Math.max((dataMax - dataMin) * 0.1, 50);
  const yMin = Math.floor((dataMin - yPadding) / 50) * 50;
  const yMax = Math.ceil((dataMax + yPadding) / 50) * 50;

  const scaleX = (index: number): number => {
    if (dataPoints.length === 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (dataPoints.length - 1)) * chartWidth;
  };

  const scaleY = (elo: number): number => {
    if (yMax === yMin) return padding.top + chartHeight / 2;
    return padding.top + (1 - (elo - yMin) / (yMax - yMin)) * chartHeight;
  };

  const linePath = dataPoints
    .map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(d.elo)}`)
    .join(" ");

  // Y-axis tick marks
  const yTickCount = 5;
  const yTicks: number[] = [];
  for (let i = 0; i <= yTickCount; i++) {
    yTicks.push(Math.round(yMin + (i / yTickCount) * (yMax - yMin)));
  }

  // X-axis labels - show a subset to avoid overlap
  const maxXLabels = Math.min(dataPoints.length, 8);
  const xLabelIndices: number[] = [];
  if (dataPoints.length <= maxXLabels) {
    for (let i = 0; i < dataPoints.length; i++) xLabelIndices.push(i);
  } else {
    for (let i = 0; i < maxXLabels; i++) {
      xLabelIndices.push(
        Math.round((i / (maxXLabels - 1)) * (dataPoints.length - 1))
      );
    }
  }

  const visibleTiers = TIER_LINES.filter(
    (t) => t.elo >= yMin && t.elo <= yMax
  );

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-3xl mx-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {yTicks.map((tick) => (
          <line
            key={`grid-${tick}`}
            x1={padding.left}
            y1={scaleY(tick)}
            x2={width - padding.right}
            y2={scaleY(tick)}
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth={0.5}
          />
        ))}

        {/* Tier reference lines */}
        {visibleTiers.map((tier) => (
          <g key={`tier-${tier.elo}`}>
            <line
              x1={padding.left}
              y1={scaleY(tier.elo)}
              x2={width - padding.right}
              y2={scaleY(tier.elo)}
              strokeDasharray="6 3"
              className="stroke-purple-400 dark:stroke-purple-500"
              strokeWidth={1}
            />
            <text
              x={width - padding.right + 4}
              y={scaleY(tier.elo) + 4}
              className="fill-purple-500 dark:fill-purple-400"
              fontSize={11}
              fontWeight={600}
            >
              {tier.label}
            </text>
          </g>
        ))}

        {/* Y-axis labels */}
        {yTicks.map((tick) => (
          <text
            key={`y-${tick}`}
            x={padding.left - 8}
            y={scaleY(tick) + 4}
            textAnchor="end"
            className="fill-gray-500 dark:fill-gray-400"
            fontSize={11}
          >
            {tick}
          </text>
        ))}

        {/* X-axis labels */}
        {xLabelIndices.map((i) => (
          <text
            key={`x-${i}`}
            x={scaleX(i)}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            className="fill-gray-500 dark:fill-gray-400"
            fontSize={10}
            transform={`rotate(-30, ${scaleX(i)}, ${height - padding.bottom + 20})`}
          >
            {dataPoints[i].date}
          </text>
        ))}

        {/* Data line */}
        {dataPoints.length > 1 && (
          <path
            d={linePath}
            fill="none"
            className="stroke-blue-500 dark:stroke-blue-400"
            strokeWidth={2}
            strokeLinejoin="round"
          />
        )}

        {/* Data points */}
        {dataPoints.map((d, i) => (
          <g key={`point-${i}`}>
            <circle
              cx={scaleX(i)}
              cy={scaleY(d.elo)}
              r={hoveredIndex === i ? 6 : 4}
              className="fill-blue-500 dark:fill-blue-400 stroke-white dark:stroke-gray-900"
              strokeWidth={2}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: "pointer" }}
            />
            {/* Larger invisible hit area */}
            <circle
              cx={scaleX(i)}
              cy={scaleY(d.elo)}
              r={12}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: "pointer" }}
            />
          </g>
        ))}

        {/* Tooltip */}
        {hoveredIndex !== null && (
          <g>
            <rect
              x={scaleX(hoveredIndex) - 65}
              y={scaleY(dataPoints[hoveredIndex].elo) - 40}
              width={130}
              height={32}
              rx={4}
              className="fill-gray-800 dark:fill-gray-200"
              opacity={0.9}
            />
            <text
              x={scaleX(hoveredIndex)}
              y={scaleY(dataPoints[hoveredIndex].elo) - 20}
              textAnchor="middle"
              className="fill-white dark:fill-gray-900"
              fontSize={11}
              fontWeight={600}
            >
              {dataPoints[hoveredIndex].date}: {dataPoints[hoveredIndex].elo}
            </text>
          </g>
        )}

        {/* Axes */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          className="stroke-gray-400 dark:stroke-gray-500"
          strokeWidth={1}
        />
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          className="stroke-gray-400 dark:stroke-gray-500"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}
