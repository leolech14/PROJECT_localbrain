// FILE: apps/desktop/src/components/Titlebar.tsx
import React from 'react'
import { Menu, X, Minus, Square } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

export function Titlebar() {
  const { sidebarOpen, toggleSidebar, settings } = useAppStore()

  return (
    <div className="flex items-center justify-between h-12 bg-gray-900 border-b border-gray-700 px-2" data-tauri-drag-region>
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
          title="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
        
        <span className="text-sm font-medium">LocalBrain</span>
        
        {settings.offline_mode && (
          <span className="px-2 py-1 bg-amber-600 text-white text-xs rounded">
            Offline
          </span>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <button
          className="p-1 hover:bg-gray-800 rounded transition-colors"
          title="Minimize"
          onClick={() => {
            // Would minimize window
          }}
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <button
          className="p-1 hover:bg-gray-800 rounded transition-colors"
          title="Maximize"
          onClick={() => {
            // Would maximize window
          }}
        >
          <Square className="w-4 h-4" />
        </button>
        
        <button
          className="p-1 hover:bg-red-600 rounded transition-colors"
          title="Close"
          onClick={() => {
            // Would close window
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}