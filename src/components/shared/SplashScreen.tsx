import { motion } from 'motion/react';

export default function SplashScreen() {
  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors"
      data-testid="splash-screen"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.8em] text-[10px] mb-6 block animate-pulse">Flow</span>
        <h1 className="text-5xl font-black text-slate-900 dark:text-slate-100 font-sans tracking-tighter">HabitTracker</h1>
      </motion.div>
    </div>
  );
}
