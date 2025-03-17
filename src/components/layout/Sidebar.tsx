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
      id="default-sidebar"
      className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-800">
        <Link
          href="/"
          className="mb-5 flex items-center ps-2.5"
        >
          <span className="whitespace-nowrap text-xl font-semibold dark:text-white">
            BizLevel
          </span>
        </Link>
        <ul className="space-y-2 font-medium">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
