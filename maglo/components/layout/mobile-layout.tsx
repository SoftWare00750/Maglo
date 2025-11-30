"use client"

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Home, FileText, CreditCard, Wallet, Settings, HelpCircle, LogOut, Bell } from 'lucide-react';
import { useMaglo } from '@/lib/context';
import Image from 'next/image';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useMaglo();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Invoices', href: '/invoices' },
    { icon: CreditCard, label: 'Transactions', href: '/transactions' },
    { icon: Wallet, label: 'Wallets', href: '/wallets' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Help', href: '/help' },
  ];

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Maglo Logo"
                width={28}
                height={28}
                className="rounded"
              />
              <span className="text-xl font-bold">Maglo</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {user?.avatar || 'MN'}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-80 bg-white z-50 transform transition-transform duration-300 shadow-xl ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Maglo Logo"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="text-2xl font-bold">Maglo</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
                {user?.avatar || 'MN'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Add padding for mobile header */}
      <div className="pt-16 lg:pt-0">
        {children}
      </div>

      {/* Mobile Bottom Navigation (Optional - uncomment if needed) */}
      {/* <MobileBottomNav pathname={pathname} router={router} /> */}
    </>
  );
}

// Optional: Bottom Navigation for Mobile
function MobileBottomNav({ pathname, router }: { pathname: string; router: any }) {
  const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: FileText, label: 'Invoices', href: '/invoices' },
    { icon: CreditCard, label: 'Transactions', href: '/transactions' },
    { icon: Settings, label: 'More', href: '/settings' },
  ];

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-0 flex-1 transition-colors ${
                active ? 'text-primary' : 'text-gray-600'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
} 