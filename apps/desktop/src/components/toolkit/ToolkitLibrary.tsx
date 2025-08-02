import React, { useState } from 'react'
import { 
  Wrench, 
  Search, 
  Filter,
  Terminal,
  Code,
  Database,
  Globe,
  FileText,
  Zap,
  Shield,
  GitBranch,
  Package,
  Clock,
  CheckCircle
} from 'lucide-react'

interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: React.ElementType
  installed: boolean
  version?: string
  commands?: string[]
  lastUsed?: Date
}

export function ToolkitLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const tools: Tool[] = [
    {
      id: '1',
      name: 'Git Helper',
      description: 'Streamlined Git operations with safety checks',
      category: 'Version Control',
      icon: GitBranch,
      installed: true,
      version: '2.1.0',
      commands: ['git-smart-commit', 'git-safe-push', 'git-visual-log'],
      lastUsed: new Date()
    },
    {
      id: '2',
      name: 'Code Formatter',
      description: 'Multi-language code formatting and linting',
      category: 'Code Quality',
      icon: Code,
      installed: true,
      version: '1.5.3',
      commands: ['format-all', 'lint-check', 'auto-fix']
    },
    {
      id: '3',
      name: 'Database Manager',
      description: 'Query and manage multiple database types',
      category: 'Database',
      icon: Database,
      installed: false
    },
    {
      id: '4',
      name: 'API Tester',
      description: 'Test and document REST/GraphQL APIs',
      category: 'Testing',
      icon: Globe,
      installed: true,
      version: '3.0.1',
      commands: ['api-test', 'api-mock', 'api-docs']
    },
    {
      id: '5',
      name: 'Security Scanner',
      description: 'Scan for vulnerabilities and security issues',
      category: 'Security',
      icon: Shield,
      installed: false
    },
    {
      id: '6',
      name: 'Performance Profiler',
      description: 'Profile and optimize application performance',
      category: 'Performance',
      icon: Zap,
      installed: true,
      version: '2.0.0',
      commands: ['profile-cpu', 'profile-memory', 'benchmark']
    }
  ]
  
  const categories = ['all', ...new Set(tools.map(t => t.category))]
  
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  
  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="px-2 py-1 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center">
            <Wrench className="w-3 h-3 mr-2" />
            Toolkit Library
          </h2>
          <div className="text-sm text-gray-400">
            {tools.filter(t => t.installed).length} of {tools.length} installed
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full pl-10 pr-3 py-2 bg-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Tools Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredTools.map(tool => {
            const Icon = tool.icon
            return (
              <div
                key={tool.id}
                className="bg-gray-900 rounded-md p-2 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-800 rounded-md mr-3">
                      <Icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{tool.name}</h3>
                      {tool.version && (
                        <span className="text-xs text-gray-500">v{tool.version}</span>
                      )}
                    </div>
                  </div>
                  {tool.installed && (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  )}
                </div>
                
                <p className="text-sm text-gray-400 mb-3">{tool.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{tool.category}</span>
                  {tool.lastUsed && (
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Used today
                    </span>
                  )}
                </div>
                
                {tool.commands && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-1">Commands:</div>
                    <div className="flex flex-wrap gap-1">
                      {tool.commands.map(cmd => (
                        <code
                          key={cmd}
                          className="text-xs px-2 py-1 bg-gray-800 rounded"
                        >
                          {cmd}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  className={`w-full py-2 rounded-md transition-colors text-sm font-medium ${
                    tool.installed
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      : 'bg-black hover:bg-gray-900 text-white'
                  }`}
                >
                  {tool.installed ? 'Configure' : 'Install'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}