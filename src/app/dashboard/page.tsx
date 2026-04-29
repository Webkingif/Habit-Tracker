'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import HabitList from '@/components/habits/HabitList';
import { getSession } from '@/lib/storage';
import { logout } from '@/lib/auth';
import { Session } from '@/types/auth';
import { LogOut, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const sessionData = getSession();
    if (sessionData) {
      Promise.resolve().then(() => setSession(sessionData));
    }
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-transparent p-4 sm:p-8" data-testid="dashboard-page">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 max-w-4xl mx-auto gap-6 sm:gap-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-700">
              <User size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 font-sans tracking-tight leading-none mb-1">Morning, Femi</h1>
              <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">{session?.email}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 w-full sm:w-auto"
          >
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm shadow-sm hover:shadow-md hover:text-rose-600 dark:hover:text-rose-400 transition-all border border-slate-100 dark:border-slate-700"
              data-testid="auth-logout-button"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </motion.div>
        </header>

        <main className="max-w-4xl mx-auto pb-20">
          <HabitList />
        </main>

        <footer className="max-w-4xl mx-auto text-center py-10 opacity-30 pointer-events-none">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">Built for Greatness</p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
