import React, { useState } from 'react'
import { 
  BookOpen, 
  Search, 
  FolderOpen,
  File,
  FileText,
  Image,
  Film,
  Music,
  Database,
  ChevronRight,
  ChevronDown,
  Plus,
  Upload,
  Download,
  Eye,
  Hash
} from 'lucide-react'

interface KnowledgeItem {
  id: string
  name: string
  type: 'folder' | 'document' | 'image' | 'video' | 'audio' | 'dataset'
  size?: string
  items?: number
  children?: KnowledgeItem[]
  expanded?: boolean
  tags?: string[]
  vectorized?: boolean
}

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([
    {
      id: '1',
      name: 'Documentation',
      type: 'folder',
      expanded: true,
      items: 42,
      children: [
        {
          id: '2',
          name: 'API Reference',
          type: 'document',
          size: '2.4 MB',
          tags: ['api', 'reference'],
          vectorized: true
        },
        {
          id: '3',
          name: 'User Guides',
          type: 'folder',
          items: 15,
          children: [
            {
              id: '4',
              name: 'Getting Started.pdf',
              type: 'document',
              size: '1.1 MB',
              vectorized: true
            }
          ]
        }
      ]
    },
    {
      id: '5',
      name: 'Code Examples',
      type: 'folder',
      expanded: true,
      items: 128,
      children: [
        {
          id: '6',
          name: 'Python Snippets',
          type: 'dataset',
          size: '456 KB',
          vectorized: true
        },
        {
          id: '7',
          name: 'React Components',
          type: 'dataset',
          size: '789 KB',
          vectorized: true
        }
      ]
    },
    {
      id: '8',
      name: 'Media Assets',
      type: 'folder',
      items: 34,
      children: [
        {
          id: '9',
          name: 'Architecture Diagrams',
          type: 'image',
          size: '3.2 MB'
        },
        {
          id: '10',
          name: 'Tutorial Videos',
          type: 'video',
          size: '124 MB'
        }
      ]
    }
  ])
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'folder': return FolderOpen
      case 'document': return FileText
      case 'image': return Image
      case 'video': return Film
      case 'audio': return Music
      case 'dataset': return Database
      default: return File
    }
  }
  
  const toggleFolder = (id: string) => {
    const toggleNode = (items: KnowledgeItem[]): KnowledgeItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded }
        }
        if (item.children) {
          return { ...item, children: toggleNode(item.children) }
        }
        return item
      })
    }
    
    setKnowledge(toggleNode(knowledge))
  }
  
  const renderTree = (items: KnowledgeItem[], level = 0) => {
    return items.map(item => {
      const Icon = getIcon(item.type)
      const isFolder = item.type === 'folder'
      
      return (
        <div key={item.id}>
          <div
            className={`flex items-center px-2 py-1.5 hover:bg-gray-900 cursor-pointer rounded ${
              selectedItem?.id === item.id ? 'bg-gray-900' : ''
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => {
              if (isFolder) {
                toggleFolder(item.id)
              }
              setSelectedItem(item)
            }}
          >
            {isFolder && (
              <span className="mr-1">
                {item.expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </span>
            )}
            <Icon className="w-4 h-4 mr-2 text-gray-400" />
            <span className="flex-1 text-sm">{item.name}</span>
            {item.vectorized && (
              <Hash className="w-3 h-3 text-green-500 mr-2" />
            )}
            {item.items && (
              <span className="text-xs text-gray-500">{item.items}</span>
            )}
            {item.size && (
              <span className="text-xs text-gray-500">{item.size}</span>
            )}
          </div>
          {isFolder && item.expanded && item.children && (
            <div>{renderTree(item.children, level + 1)}</div>
          )}
        </div>
      )
    })
  }
  
  return (
    <div className="flex h-full bg-black">
      {/* Tree View */}
      <div className="w-80 border-r border-gray-800 flex flex-col">
        <div className="px-2 py-1 border-b border-gray-800">
          <h2 className="text-sm font-semibold flex items-center mb-3">
            <BookOpen className="w-3 h-3 mr-2" />
            Knowledge Base
          </h2>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge..."
              className="w-full pl-10 pr-3 py-2 bg-gray-900 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="px-2 py-2 border-b border-gray-800 flex items-center space-x-2">
          <button className="flex-1 px-3 py-1.5 bg-black text-white rounded-md hover:bg-gray-900 transition-colors text-sm">
            <Plus className="w-4 h-4 inline mr-1" />
            Add
          </button>
          <button className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors text-sm">
            <Upload className="w-4 h-4 inline mr-1" />
            Import
          </button>
        </div>
        
        {/* Tree */}
        <div className="flex-1 overflow-y-auto p-2">
          {renderTree(knowledge)}
        </div>
        
        {/* Stats */}
        <div className="px-2 py-1 border-t border-gray-800 text-xs text-gray-500">
          <div>Total items: 219</div>
          <div>Vectorized: 146</div>
          <div>Storage: 134 MB</div>
        </div>
      </div>
      
      {/* Preview */}
      <div className="flex-1 flex flex-col">
        {selectedItem ? (
          <>
            <div className="px-2 py-1 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">{selectedItem.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                  <span>{selectedItem.type}</span>
                  {selectedItem.size && <span>{selectedItem.size}</span>}
                  {selectedItem.vectorized && (
                    <span className="text-green-500">Vectorized</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-900 rounded transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-900 rounded transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Tags */}
            {selectedItem.tags && (
              <div className="px-2 py-2 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Tags:</span>
                  {selectedItem.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-800 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Content Preview */}
            <div className="flex-1 p-2 overflow-auto">
              {selectedItem.type === 'folder' ? (
                <div className="text-center text-gray-500">
                  <FolderOpen className="w-16 h-16 mx-auto mb-1" />
                  <p>Folder contains {selectedItem.items} items</p>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-md p-2">
                  <p className="text-gray-400">
                    Preview for {selectedItem.name} would appear here.
                  </p>
                  {selectedItem.type === 'document' && (
                    <div className="mt-1 space-y-2">
                      <div className="h-2 bg-gray-800 rounded w-full"></div>
                      <div className="h-2 bg-gray-800 rounded w-4/5"></div>
                      <div className="h-2 bg-gray-800 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-800 rounded w-5/6"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-1" />
              <p>Select an item to preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}