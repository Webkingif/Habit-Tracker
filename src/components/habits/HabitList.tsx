'use client';

import { useEffect, useState } from 'react';
import { getHabitsByUserId } from '@/lib/storage';
import { getSession } from '@/lib/storage';
import { Habit } from '@/types/habit';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sparkles, BookOpen } from 'lucide-react';

export default function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshHabits = () => {
    const session = getSession();
    if (session) {
      const userHabits = getHabitsByUserId(session.userId);
      Promise.resolve().then(() => setHabits(userHabits));
    }
  };

  useEffect(() => {
    refreshHabits();
    Promise.resolve().then(() => setLoading(false));
  }, []);

  const [isCreating, setIsCreating] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full"
      />
      <p className="text-slate-400 font-medium animate-pulse">Gathering your progress...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            Your Habits
            <Sparkles className="text-yellow-400" size={24} />
          </h2>
          <p className="text-slate-400 dark:text-slate-500 font-medium tracking-wide">
            {habits.length === 0 ? "Let's start something new today!" : `${habits.length} active goals to crush.`}
          </p>
        </div>
        {!isCreating && !editingHabit && (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white font-bold p-4 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all flex items-center gap-2"
            data-testid="create-habit-button"
          >
            <Plus size={24} strokeWidth={3} />
            <span className="hidden sm:inline pr-1">Add Habit</span>
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {(isCreating || editingHabit) ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8"
          >
            <HabitForm 
              onSuccess={() => { refreshHabits(); setIsCreating(false); setEditingHabit(null); }} 
              onCancel={() => { setIsCreating(false); setEditingHabit(null); }}
              initialData={editingHabit || undefined}
            />
          </motion.div>
        ) : habits.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 px-8 bg-white dark:bg-slate-800/40 border-2 border-dashed rounded-3xl border-slate-100 dark:border-slate-800 shadow-sm"
            data-testid="empty-state"
          >
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
              <BookOpen size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Blank Canvas</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              Every master was once a beginner. Start your first habit and track your journey.
            </p>
            <button 
              onClick={() => setIsCreating(true)}
              className="mt-8 text-blue-600 dark:text-blue-400 font-bold hover:underline decoration-2 underline-offset-4"
            >
              Ready to start?
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            layout
            className="grid gap-6 md:grid-cols-1 lg:grid-cols-1"
          >
            <AnimatePresence mode="popLayout">
              {habits.map((habit) => (
                <HabitCard 
                  key={habit.id} 
                  habit={habit} 
                  onUpdate={refreshHabits}
                  onEdit={(h) => setEditingHabit(h)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
