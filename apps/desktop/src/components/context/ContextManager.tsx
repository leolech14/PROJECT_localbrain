import React, { useState } from 'react'
import { Brain, Save, Upload, Download, Plus, Edit, Trash2, Copy, Check } from 'lucide-react'
import Editor from '@monaco-editor/react'

interface ContextTemplate {
  id: string
  name: string
  description: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export function ContextManager() {
  const [templates, setTemplates] = useState<ContextTemplate[]>([
    {
      id: '1',
      name: 'Code Review Assistant',
      description: 'Context for performing thorough code reviews',
      content: `You are an expert code reviewer. When reviewing code:
- Check for bugs, security vulnerabilities, and performance issues
- Suggest improvements for readability and maintainability
- Ensure best practices are followed
- Be constructive and educational in feedback`,
      tags: ['code', 'review', 'quality'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Debugging Expert',
      description: 'Context for systematic debugging and troubleshooting',
      content: `You are a debugging expert. When helping debug issues:
- Ask clarifying questions about the problem
- Suggest systematic debugging approaches
- Help interpret error messages and stack traces
- Provide step-by-step troubleshooting guides`,
      tags: ['debug', 'troubleshoot', 'errors'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  
  const [selectedTemplate, setSelectedTemplate] = useState<ContextTemplate | null>(templates[0])
  const [editingTemplate, setEditingTemplate] = useState<ContextTemplate | null>(null)
  const [showNewTemplate, setShowNewTemplate] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const handleSave = (template: ContextTemplate) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === template.id ? template : t))
      setEditingTemplate(null)
    } else {
      setTemplates([...templates, { ...template, id: Date.now().toString() }])
      setShowNewTemplate(false)
    }
    setSelectedTemplate(template)
  }
  
  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id))
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(templates[0] || null)
    }
  }
  
  const handleCopy = (template: ContextTemplate) => {
    navigator.clipboard.writeText(template.content)
    setCopiedId(template.id)
    setTimeout(() => setCopiedId(null), 2000)
  }
  
  return (
    <div className="flex h-full bg-black">
      {/* Templates List */}
      <div className="w-80 border-r border-gray-800 flex flex-col">
        <div className="px-2 py-1 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center">
              <Brain className="w-3 h-3 mr-2" />
              Context Templates
            </h2>
            <button
              onClick={() => setShowNewTemplate(true)}
              className="p-1 hover:bg-gray-900 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {templates.map(template => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`p-3 mb-2 rounded-md cursor-pointer transition-colors ${
                selectedTemplate?.id === template.id
                  ? 'bg-black text-white'
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className={`text-sm mt-1 ${
                    selectedTemplate?.id === template.id ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.map(tag => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded ${
                          selectedTemplate?.id === template.id
                            ? 'bg-blue-700 text-blue-100'
                            : 'bg-gray-800 text-gray-300'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Template Editor */}
      <div className="flex-1 flex flex-col">
        {(selectedTemplate || showNewTemplate || editingTemplate) ? (
          <>
            <div className="px-2 py-1 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {editingTemplate ? 'Edit Template' : showNewTemplate ? 'New Template' : selectedTemplate?.name}
              </h3>
              <div className="flex items-center space-x-2">
                {!editingTemplate && !showNewTemplate && (
                  <>
                    <button
                      onClick={() => handleCopy(selectedTemplate!)}
                      className="p-2 hover:bg-gray-900 rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedId === selectedTemplate?.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingTemplate(selectedTemplate)}
                      className="p-2 hover:bg-gray-900 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedTemplate!.id)}
                      className="p-2 hover:bg-gray-900 rounded text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                {(editingTemplate || showNewTemplate) && (
                  <>
                    <button
                      onClick={() => {
                        // Save logic would go here
                        setEditingTemplate(null)
                        setShowNewTemplate(false)
                      }}
                      className="px-2 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingTemplate(null)
                        setShowNewTemplate(false)
                      }}
                      className="px-2 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-2">
              <Editor
                height="100%"
                language="markdown"
                theme="vs-dark"
                value={editingTemplate?.content || showNewTemplate ? '' : selectedTemplate?.content}
                options={{
                  readOnly: !editingTemplate && !showNewTemplate,
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  lineNumbers: 'off',
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-1" />
              <p>Select a template or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}