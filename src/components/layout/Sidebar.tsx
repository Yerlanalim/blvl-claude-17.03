'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navigation: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'My Progress', href: '/progress', icon: '📈' },
  { label: 'Levels', href: '/levels', icon: '🎮' },
  { label: 'Skills', href: '/skills', icon: '⭐' },
  { label: 'Resources', href: '/resources', icon: '📚' },
  { label: 'Achievements', href: '/achievements', icon: '🏆' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`transition-width fixed top-0 left-0 z-40 h-screen border-r border-gray-200 bg-white duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} `}
    >
      <div className="h-full overflow-y-auto px-3 py-4">
        {/* Logo */}
        <Link href="/" className="mb-5 flex items-center pl-2.5">
          <span
            className={`self-center text-xl font-semibold whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'} `}
          >
            BizLevel
          </span>
        </Link>

        {/* User Profile */}
        <div className="mb-6 flex items-center gap-4 pl-2.5">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image src="/placeholder-avatar.png" alt="User avatar" fill className="object-cover" />
          </div>
          {!isCollapsed && (
            <div>
              <h3 className="text-sm font-medium">John Doe</h3>
              <p className="text-xs text-gray-500">Level 5</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100"
            >
              <span className="h-6 w-6 text-center">{item.icon}</span>
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="fixed bottom-4 left-4 p-2 text-gray-500 hover:text-gray-900"
        >
          {isCollapsed ? '→' : '←'}
        </button>

        {/* Logout Button */}
        <button
          onClick={() => console.log('Logout clicked')}
          className="fixed bottom-16 left-4 flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100"
        >
          <span className="h-6 w-6 text-center">🚪</span>
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
