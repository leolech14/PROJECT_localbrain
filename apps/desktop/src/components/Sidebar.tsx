// FILE: apps/desktop/src/components/Sidebar.tsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  MessageCircle, 
  Terminal, 
  Folder, 
  Bot, 
  Wrench, 
  BookOpen, 
  Settings,
  Mic,
  MicOff
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { cn } from '../utils/cn'

const navigationItems = [
  { icon: MessageCircle, label: 'Chat', path: '/chat' },
  { icon: Terminal, label: 'Terminal', path: '/terminal' },
  { icon: Folder, label: 'Files', path: '/files' },
  { icon: Bot, label: 'Agents', path: '/agents' },
  { icon: Wrench, label: 'Toolkit', path: '/toolkit' },
  { icon: BookOpen, label: 'Knowledge', path: '/knowledge' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export function Sidebar() {
  const location = useLocation()
  const { isVoiceActive, startVoiceSession, stopVoiceSession } = useAppStore()

  const handleVoiceToggle = async () => {
    if (isVoiceActive) {
      await stopVoiceSession()
    } else {
      await startVoiceSession({ type: 'listening' })
    }
  }

  return (
    <div className="w-48 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Logo and title */}
      <div className="p-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">LB</span>
          </div>
          <span className="text-sm font-semibold">LocalBrain</span>
        </div>
      </div>

      {/* Voice control */}
      <div className="p-2 border-b border-gray-700">
        <button
          onClick={handleVoiceToggle}
          className={cn(
            "w-full flex items-center justify-center space-x-1 p-1.5 rounded text-xs transition-colors",
            isVoiceActive 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-gray-800 hover:bg-gray-700 text-gray-300"
          )}
        >
          {isVoiceActive ? (
            <>
              <Mic className="w-3 h-3" />
              <span>Listening...</span>
            </>
          ) : (
            <>
              <MicOff className="w-3 h-3" />
              <span>Start Voice</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-0.5">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
              (item.path === '/chat' && location.pathname === '/')
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 p-1.5 rounded text-xs transition-colors",
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Status */}
      <div className="p-2 border-t border-gray-700">
        <div className="text-xs text-gray-400 space-y-0.5" style={{ fontSize: '10px' }}>
          <div className="flex justify-between">
            <span>Mode:</span>
            <span className="text-green-400">Online</span>
          </div>
          <div className="flex justify-between">
            <span>Voice:</span>
            <span className={isVoiceActive ? "text-green-400" : "text-gray-500"}>
              {isVoiceActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}