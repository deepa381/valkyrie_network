'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { NAVIGATION_LINKS } from '@/utils/constants';
import { cn } from '@/lib/utils';

export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full w-64 bg-black border-r border-zinc-800 z-50 lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-zinc-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Icons.Zap className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold text-white">
                Valkyrie
              </span>
            </Link>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {NAVIGATION_LINKS.map((link) => {
                const Icon = Icons[link.icon] || Icons.Circle;
                const isActive = pathname === link.href;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.disabled ? '#' : link.href}
                      onClick={(e) => {
                        if (link.disabled) {
                          e.preventDefault();
                        }
                        onClose?.();
                      }}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative',
                        isActive
                          ? 'bg-yellow-500 text-black'
                          : link.disabled
                          ? 'text-zinc-600 cursor-not-allowed'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{link.name}</span>
                      {link.disabled && (
                        <span className="ml-auto text-xs bg-zinc-800 px-2 py-1 rounded">
                          Soon
                        </span>
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-yellow-500 rounded-lg -z-10"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-zinc-800">
            <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-lg border border-yellow-500/20">
              <p className="text-sm font-semibold text-white mb-1">
                Upgrade to Pro
              </p>
              <p className="text-xs text-zinc-400 mb-3">
                Unlock advanced features
              </p>
              <button className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-semibold rounded-lg transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}
    </>
  );
}
