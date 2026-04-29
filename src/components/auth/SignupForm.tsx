'use client';

import { useState } from 'react';
import { signup, login } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { UserPlus, Sparkles } from 'lucide-react';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      await signup(email, password);
      await login(email, password); 
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="flex flex-col gap-6 w-full max-w-sm bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white dark:focus:bg-slate-900 px-5 py-4 rounded-2xl outline-none transition-all text-slate-900 dark:text-slate-100 font-medium"
          required
          autoComplete="email"
          data-testid="auth-signup-email"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Choose a password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white dark:focus:bg-slate-900 px-5 py-4 rounded-2xl outline-none transition-all text-slate-900 dark:text-slate-100 font-medium"
          required
          autoComplete="new-password"
          data-testid="auth-signup-password"
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          className="text-rose-500 text-xs font-bold pl-1"
        >
          {error}
        </motion.p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-emerald-600 text-white font-bold py-5 rounded-2xl hover:bg-emerald-700 disabled:opacity-50 shadow-xl shadow-emerald-200 dark:shadow-none transition-all flex items-center justify-center gap-2 group"
        data-testid="auth-signup-submit"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            Creating Profile...
          </span>
        ) : (
          <>
            <span>Start My Journey</span>
            <Sparkles size={20} className="group-hover:scale-110 transition-transform text-emerald-200" />
          </>
        )}
      </button>
    </motion.form>
  );
}
