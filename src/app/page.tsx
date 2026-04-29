'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/storage';
import SplashScreen from '@/components/shared/SplashScreen';

export default function HomePage() {
  const router = useRouter();
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinishing(true);
      const session = getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 1200); // Between 800ms and 2000ms

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
