'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';
import { getSession, getHabits, saveHabits } from '@/lib/storage';
import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';

interface HabitFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
  initialData?: Habit;
}

export default function HabitForm({ onSuccess, onCancel, initialData }: HabitFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [frequency, setFrequency] = useState<'daily'>(initialData?.frequency || 'daily');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const session = getSession();
    if (!session) return;

    const allHabits = getHabits();
    
    if (initialData) {
      const updatedHabits = allHabits.map((h) => 
        h.id === initialData.id 
          ? { ...h, name: validation.value, description, frequency } 
          : h
      );
      saveHabits(updatedHabits);
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: session.userId,
        name: validation.value,
        description,
        frequency,
        createdAt: new Date().toISOString(),
        completions: [],
      };
      saveHabits([...allHabits, newHabit]);
    }

    onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-md mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {initialData ? 'Edit Habit' : 'New Habit'}
        </h2>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" data-testid="habit-form">
        <div className="flex flex-col gap-2">
          <label htmlFor="habit-name" className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Name</label>
          <input
            id="habit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-slate-900 px-5 py-4 rounded-2xl outline-none transition-all text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400"
            placeholder="What habit will you start?"
            autoFocus
            data-testid="habit-name-input"
          />
          {error && <p className="text-rose-500 text-xs font-bold mt-1 pl-1">{error}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="habit-description" className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Description</label>
          <textarea
            id="habit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-slate-900 px-5 py-4 rounded-2xl outline-none transition-all h-32 resize-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            placeholder="Set a reminder for yourself..."
            data-testid="habit-description-input"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="habit-frequency" className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Frequency</label>
          <div className="relative">
            <select
              id="habit-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'daily')}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent px-5 py-4 rounded-2xl outline-none appearance-none cursor-pointer text-slate-900 dark:text-slate-100 font-medium"
              data-testid="habit-frequency-select"
            >
              <option value="daily">Daily</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Check size={18} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2 group"
          data-testid="habit-save-button"
        >
          <span>{initialData ? 'Update Habit' : 'Create Habit'}</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Check size={20} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
          </motion.div>
        </button>
      </form>
    </motion.div>
  );
}
