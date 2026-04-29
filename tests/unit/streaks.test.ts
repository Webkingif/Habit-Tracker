import { expect, describe, it } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */
describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], '2024-01-01')).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak(['2023-12-31'], '2024-01-01')).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    const completions = ['2024-01-01', '2023-12-31', '2023-12-30'];
    expect(calculateCurrentStreak(completions, '2024-01-01')).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    const completions = ['2024-01-01', '2024-01-01', '2023-12-31'];
    expect(calculateCurrentStreak(completions, '2024-01-01')).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    const completions = ['2024-01-01', '2023-12-30'];
    expect(calculateCurrentStreak(completions, '2024-01-01')).toBe(1);
  });
});
