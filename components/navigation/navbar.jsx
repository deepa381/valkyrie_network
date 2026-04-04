'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell, Settings, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuthStore } from '@/store/authStore';
import { useDashboardStore } from '@/store/dashboardStore';
import { getInitials, formatDate } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

export function Navbar({ onMenuClick }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } =
    useDashboardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass-nav">
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 30%, rgba(212,175,55,0.15) 70%, transparent 100%)' }} />

      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative flex-1 max-w-sm hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="search"
              placeholder="Search founders, startups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-600 rounded-lg outline-none transition-all duration-300"
              style={{
                background: searchFocused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
                border: searchFocused
                  ? '1px solid rgba(212,175,55,0.35)'
                  : '1px solid rgba(255,255,255,0.08)',
                boxShadow: searchFocused ? '0 0 0 3px rgba(212,175,55,0.07)' : 'none',
              }}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold text-[#0B0F19]"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #F5C542)', minWidth: '18px', minHeight: '18px', padding: '1px' }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 border-[rgba(255,255,255,0.08)] shadow-card"
              style={{ background: '#111827' }}
              align="end"
            >
              <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.06)]">
                <h3 className="font-semibold text-white text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-[#D4AF37] hover:text-[#F5C542] transition-colors font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <EmptyState
                    size="compact"
                    icon="Bell"
                    title="No notifications"
                    description="You are all caught up. New alerts will appear here."
                  />
                ) : (
                  <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markNotificationRead(notification.id)}
                        className="p-4 cursor-pointer transition-colors hover:bg-white/[0.03]"
                        style={{ background: !notification.read ? 'rgba(212,175,55,0.03)' : 'transparent' }}
                      >
                        <div className="flex items-start gap-3">
                          {!notification.read && (
                            <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #D4AF37, #F5C542)' }} />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white mb-0.5 leading-tight">
                              {notification.title}
                            </p>
                            <p className="text-xs text-slate-400 mb-1 leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-600">
                              {formatDate(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative ml-1 rounded-full transition-all duration-200 hover:ring-2 hover:ring-[rgba(212,175,55,0.4)]">
                <Avatar className="h-9 w-9 border-2 border-[rgba(212,175,55,0.35)]">
                  <AvatarFallback
                    className="text-sm font-bold"
                    style={{ background: 'rgba(212,175,55,0.15)', color: '#F5C542' }}>
                    {getInitials(user?.name || 'User')}
                  </AvatarFallback>
                </Avatar>
                {/* Online status dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0F19]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 border-[rgba(255,255,255,0.08)] shadow-card"
              style={{ background: '#111827' }}
              align="end"
            >
              <DropdownMenuLabel className="text-white px-3 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-[rgba(212,175,55,0.3)]">
                    <AvatarFallback className="text-xs font-bold"
                      style={{ background: 'rgba(212,175,55,0.15)', color: '#F5C542' }}>
                      {getInitials(user?.name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.06)]" />
              <DropdownMenuItem
                onClick={() => router.push('/profile')}
                className="text-slate-300 focus:text-white focus:bg-white/5 cursor-pointer mx-1 rounded-lg my-0.5"
              >
                <User className="mr-2.5 h-4 w-4 text-slate-400" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push('/settings')}
                className="text-slate-300 focus:text-white focus:bg-white/5 cursor-pointer mx-1 rounded-lg my-0.5"
              >
                <Settings className="mr-2.5 h-4 w-4 text-slate-400" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.06)]" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer mx-1 rounded-lg my-0.5"
              >
                <LogOut className="mr-2.5 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
