'use client';

import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <span className="text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">New Chapter</span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Join HabitFlow</h1>
      </motion.div>

      <SignupForm />

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-sm text-slate-400 font-medium"
      >
        Already tracking?{' '}
        <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline underline-offset-4">
          Jump back in
        </Link>
      </motion.p>
    </div>
  );
}
