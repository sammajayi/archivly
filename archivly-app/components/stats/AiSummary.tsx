import { useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { generateSummary, type SummaryPeriod } from '../../lib/summaries';
import { colors } from '../../lib/theme';
import type { PeriodRange } from '../../lib/stats';

export function AiSummary({
  period,
  range,
  disabled,
  disabledReason,
}: {
  period: SummaryPeriod;
  range: PeriodRange;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = period === 'week' ? 'Generate my week' : 'Generate my month';

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      setSummary(await generateSummary(period, range));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate a summary.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="items-center gap-2 py-6">
        <ActivityIndicator color={colors.primary} />
        <Text className="text-sm text-text-secondary">Writing your recap...</Text>
      </Card>
    );
  }

  if (summary) {
    return (
      <Card className="gap-3 border-l-4 border-l-primary">
        <Text className="text-[15px] italic leading-6 text-text-primary">{summary}</Text>
        <Button label="Regenerate" variant="secondary" onPress={handleGenerate} />
      </Card>
    );
  }

  return (
    <Card className="gap-2">
      <Button label={label} onPress={handleGenerate} disabled={disabled} />
      {error ? <Text className="text-sm text-loss">{error}</Text> : null}
      {disabled && disabledReason ? <Text className="text-xs text-text-secondary">{disabledReason}</Text> : null}
      {/* Free tier: 1 AI summary per calendar month. Not enforced yet --
          Phase 2 paywall wiring will check usage before allowing this button
          to call generateSummary again once the monthly allowance is used. */}
    </Card>
  );
}
