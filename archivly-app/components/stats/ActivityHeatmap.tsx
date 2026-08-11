import { ScrollView, View } from 'react-native';
import { startOfWeek, toDateString, type HeatmapDay } from '../../lib/stats';

const CELL_SIZE = 12;
const CELL_GAP = 3;
const EMPTY_CELL_COLOR = '#EBEBEB'; // light grey grid, per PRD -- not the same as border color so cells read distinctly

// Soft green scale, capped at the design system's win green -- deliberately
// muted (no saturated/loud greens) per PRD 6.3.
const LEVEL_COLORS = ['#DCFCE7', '#86EFAC', '#4ADE80', '#16A34A'];

function levelColor(count: number, max: number): string {
  if (count === 0 || max <= 0) return EMPTY_CELL_COLOR;
  const ratio = count / max;
  if (ratio > 0.75) return LEVEL_COLORS[3];
  if (ratio > 0.5) return LEVEL_COLORS[2];
  if (ratio > 0.25) return LEVEL_COLORS[1];
  return LEVEL_COLORS[0];
}

interface Cell {
  date: string | null; // null = padding outside the period, rendered blank
  count: number;
}

function buildWeeks(start: string, end: string): Cell[][] {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const gridStart = startOfWeek(startDate);

  const days: Cell[] = [];
  const cursor = new Date(gridStart);
  while (cursor <= endDate) {
    const inRange = cursor >= startDate;
    days.push({ date: inRange ? toDateString(cursor) : null, count: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  while (days.length % 7 !== 0) {
    days.push({ date: null, count: 0 });
  }

  const weeks: Cell[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function ActivityHeatmap({ start, end, data }: { start: string; end: string; data: HeatmapDay[] }) {
  const counts = new Map(data.map((d) => [d.date, d.count]));
  const max = data.reduce((m, d) => Math.max(m, d.count), 0);
  const weeks = buildWeeks(start, end);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', gap: CELL_GAP }}>
        {weeks.map((week, wi) => (
          <View key={wi} style={{ gap: CELL_GAP }}>
            {week.map((cell, di) => (
              <View
                key={di}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  borderRadius: 3,
                  backgroundColor: cell.date === null ? 'transparent' : levelColor(counts.get(cell.date) ?? 0, max),
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
