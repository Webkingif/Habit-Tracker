export type HabitFrequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly';

export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: HabitFrequency;
  createdAt: string;
  completions: string[];
};
