import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  MessageSquare, 
  Terminal, 
  FileCode, 
  FolderOpen, 
  Brain, 
  Network, 
  BookOpen, 
  Library, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const menuItems = [
    { icon: MessageSquare, label: 'Chat', path: '/' },
    { icon: Terminal, label: 'Terminal', path: '/terminal' },
    { icon: FileCode, label: 'Editor', path: '/editor' },
    { icon: FolderOpen, label: 'Explorer', path: '/explorer' },
    { icon: Brain, label: 'Context', path: '/context' },
    { icon: Network, label: 'Agents', path: '/agents' },
    { icon: Library, label: 'Toolkit', path: '/toolkit' },
    { icon: BookOpen, label: 'Knowledge', path: '/knowledge' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]
  
  return (
    <div className={`${collapsed ? 'w-12' : 'w-48'} bg-black border-r border-gray-900 transition-all duration-300 flex flex-col`}>
      {/* Logo and Toggle */}
      <div className="p-2 flex items-center justify-between">
        {!collapsed && (
          <span className="text-sm font-semibold text-gray-300">LocalBrain</span>
        )}
        <button
          onClick={onToggle}
          className="p-1 hover:bg-black rounded transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-1 py-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center px-2 py-1.5 rounded-md transition-colors text-xs
                ${isActive 
                  ? 'bg-black text-white' 
                  : 'text-gray-400 hover:bg-black hover:text-white'
                }
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="ml-2">{item.label}</span>}
            </button>
          )
        })}
      </nav>
      
      {/* Version */}
      {!collapsed && (
        <div className="p-2 text-xs text-gray-600">
          v1.0.0
        </div>
      )}
    </div>
  )
}