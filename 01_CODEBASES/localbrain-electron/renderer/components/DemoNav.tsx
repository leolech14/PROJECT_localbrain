/**
 * Demo Navigation - T011 Implementation
 * =====================================
 *
 * Simple navigation to switch between main app and React Query demo
 */

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DemoNav() {
  const pathname = usePathname();

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-2">
      <div className="flex space-x-2">
        <Link
          href="/"
          className={`px-3 py-1 text-sm rounded transition-colors ${
            pathname === '/'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Main App
        </Link>
        <Link
          href="/demo"
          className={`px-3 py-1 text-sm rounded transition-colors ${
            pathname === '/demo'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          React Query
        </Link>
        <Link
          href="/offline-demo"
          className={`px-3 py-1 text-sm rounded transition-colors ${
            pathname === '/offline-demo'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Offline Demo
        </Link>
      </div>
    </div>
  );
}