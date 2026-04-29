'use client';

import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { toggleHabitCompletion } from '@/lib/habits';
import { getHabits, saveHabits } from '@/lib/storage';
import { Check, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HabitCardProps {
  habit: Habit;
  onUpdate: () => void;
  onEdit: (habit: Habit) => void;
}

export default function HabitCard({ habit, onUpdate, onEdit }: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = () => {
    const updatedHabit = toggleHabitCompletion(habit, today);
    const allHabits = getHabits();
    const updatedHabits = allHabits.map((h) => (h.id === habit.id ? updatedHabit : h));
    saveHabits(updatedHabits);
    onUpdate();
  };

  const handleDelete = () => {
    const allHabits = getHabits();
    const updatedHabits = allHabits.filter((h) => h.id !== habit.id);
    saveHabits(updatedHabits);
    onUpdate();
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300"
      data-testid={`habit-card-${slug}`}
    >
      <div className="flex items-center gap-5 flex-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-colors duration-500 ${
            isCompletedToday 
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40' 
              : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-transparent hover:text-slate-300'
          }`}
          data-testid={`habit-complete-${slug}`}
        >
          <motion.div
            initial={false}
            animate={{ scale: isCompletedToday ? 1 : 0.8, opacity: isCompletedToday ? 1 : 0 }}
          >
            <Check size={28} strokeWidth={3} />
          </motion.div>
        </motion.button>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-lg leading-tight">{habit.name}</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <span className="text-[10px] font-black uppercase tracking-tighter">Streak</span>
              <span className="text-sm font-mono font-bold" data-testid={`habit-streak-${slug}`}>{streak}</span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
              {habit.frequency}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(habit)}
          className="p-2.5 text-slate-300 hover:text-blue-500 dark:text-slate-600 dark:hover:text-blue-400 transition-colors"
          data-testid={`habit-edit-${slug}`}
          title="Edit habit"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => setIsDeleting(true)}
          className="p-2.5 text-slate-300 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400 transition-colors"
          data-testid={`habit-delete-${slug}`}
          title="Delete habit"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <AnimatePresence>
        {isDeleting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-700"
            >
              <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 text-center">Delete Habit?</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-center leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">&quot;{habit.name}&quot;</span>? This cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDelete}
                  className="w-full px-6 py-4 text-sm font-bold text-white bg-rose-500 rounded-2xl hover:bg-rose-600 shadow-xl shadow-rose-200 dark:shadow-none transition-all"
                  data-testid="confirm-delete-button"
                >
                  Yes, Delete Habit
                </button>
                <button 
                  onClick={() => setIsDeleting(false)}
                  className="w-full px-6 py-4 text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  Changed my mind
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
