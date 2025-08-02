import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { StatusBar } from './StatusBar'
import { useAppStore } from '../../stores/appStore'

export function MainLayout() {
  const { currentView, sidebarOpen, toggleSidebar } = useAppStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(!sidebarOpen)

  return (
    <div className="h-screen flex flex-col bg-black text-gray-100">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 bg-black overflow-auto">
          <Outlet />
        </div>
      </div>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  )
}