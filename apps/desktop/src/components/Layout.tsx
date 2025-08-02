// FILE: apps/desktop/src/components/Layout.tsx
import React from 'react'
import { Sidebar } from './Sidebar'
import { Titlebar } from './Titlebar'
import { useAppStore } from '../stores/appStore'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Titlebar />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}