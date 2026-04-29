'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/storage';

import { motion } from 'motion/react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/login');
    } else {
      // Use a microtask or next tick to avoid synchronous update error
      Promise.resolve().then(() => setIsAuthorized(true));
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]"
        >
          Secure Flow
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
