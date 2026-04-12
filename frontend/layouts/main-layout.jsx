'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/navigation/sidebar';
import { Navbar } from '@/components/navigation/navbar';
import { useAuthStore } from '@/store/authStore';

export function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let persistedToken = null;
    try {
      const authStorage = localStorage.getItem('auth-storage');
      persistedToken = authStorage ? JSON.parse(authStorage)?.state?.token : null;
    } catch (_error) {
      persistedToken = null;
    }

    if (!isAuthenticated && !token && !persistedToken) {
      router.replace('/auth/login');
    }

    setCheckedAuth(true);
  }, [isAuthenticated, token, router]);

  if (!checkedAuth) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: '#0B0F19' }}>
      {/* Subtle ambient gradient */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 60%)',
        }}
      />
      {/* Dot grid overlay */}
      <div className="fixed inset-0 pointer-events-none dot-grid opacity-[0.35]"
        style={{ backgroundSize: '28px 28px' }}
      />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 relative z-10">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="min-h-[calc(100vh-4rem)]"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
