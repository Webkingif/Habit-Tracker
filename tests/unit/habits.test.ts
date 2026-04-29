import { expect, describe, it } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';

describe('toggleHabitCompletion', () => {
  const mockHabit: Habit = {
    id: '1',
    userId: 'user1',
    name: 'Habit 1',
    description: 'Desc',
    frequency: 'daily',
    createdAt: '2024-01-01T00:00:00Z',
    completions: [],
  };

  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(mockHabit, '2024-01-01');
    expect(result.completions).toContain('2024-01-01');
    expect(result.completions.length).toBe(1);
  });

  it('removes a completion date when the date already exists', () => {
    const habitWithCompletion = { ...mockHabit, completions: ['2024-01-01'] };
    const result = toggleHabitCompletion(habitWithCompletion, '2024-01-01');
    expect(result.completions).not.toContain('2024-01-01');
    expect(result.completions.length).toBe(0);
  });

  it('does not mutate the original habit object', () => {
    const originalCompletions = [...mockHabit.completions];
    toggleHabitCompletion(mockHabit, '2024-01-01');
    expect(mockHabit.completions).toEqual(originalCompletions);
  });

  it('does not return duplicate completion dates', () => {
    // This tests the deduplication in toggleHabitCompletion
    const habitWithCompletion = { ...mockHabit, completions: ['2024-01-01'] };
    // This is a bit contrived since the function itself usually handles the logic, 
    // but we want to ensure the final result is unique.
    const result = toggleHabitCompletion(habitWithCompletion, '2024-01-01');
    expect(result.completions.length).toBe(new Set(result.completions).size);
  });
});
