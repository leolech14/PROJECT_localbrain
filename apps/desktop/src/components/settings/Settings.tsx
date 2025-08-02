import React, { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Globe, 
  Mic, 
  Terminal, 
  Shield, 
  Palette,
  Database,
  Bell,
  Key,
  Save,
  RotateCcw,
  Trash2
} from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

export function Settings() {
  const { settings, updateSettings } = useAppStore()
  const [activeTab, setActiveTab] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(150) // Smaller default width
  
  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'ai', label: 'AI Providers', icon: Globe },
    { id: 'voice', label: 'Voice Settings', icon: Mic },
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]
  
  const handleSave = async () => {
    // Settings are auto-saved through updateSettings
    setHasChanges(false)
  }
  
  const handleReset = () => {
    // Reset to defaults
    setHasChanges(false)
  }
  
  return (
    <div className="flex h-full bg-black">
      {/* Tabs */}
      <div 
        className="bg-black border-r border-gray-900"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="px-2 py-1 border-b border-gray-900">
          <h2 className="text-xs font-semibold">Settings</h2>
        </div>
        <nav className="p-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-2 py-1 rounded-md mb-0.5 text-xs transition-colors ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-gray-300 hover:bg-black'
                }`}
              >
                <Icon className="w-3 h-3 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>
      
      {/* Resize Handle */}
      <div
        className="w-1 bg-gray-900 hover:bg-gray-700 cursor-col-resize transition-colors"
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.pageX;
          const startWidth = sidebarWidth;
          
          const handleMouseMove = (e: MouseEvent) => {
            const newWidth = Math.max(120, Math.min(250, startWidth + e.pageX - startX));
            setSidebarWidth(newWidth);
          };
          
          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      />
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 max-w-2xl">
          {activeTab === 'general' && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold mb-1">General Settings</h3>
              
              <div>
                <label className="flex items-center justify-between p-2 bg-black rounded-md">
                  <div>
                    <div className="text-xs font-medium">Offline Mode</div>
                    <div className="text-xs text-gray-400">Use only local AI providers</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.offline_mode}
                    onChange={(e) => {
                      updateSettings({ offline_mode: e.target.checked })
                      setHasChanges(true)
                    }}
                    className="w-4 h-4 text-gray-400 rounded"
                  />
                </label>
              </div>
              
              <div>
                <label className="block mb-1 text-xs font-medium">Allowed File Roots</label>
                <div className="space-y-1">
                  {settings.allowed_roots.map((root, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <input
                        type="text"
                        value={root}
                        readOnly
                        className="flex-1 px-2 py-0.5 text-xs bg-black rounded"
                      />
                      <button className="p-1 text-red-400 hover:bg-black rounded">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button className="px-2 py-0.5 text-xs bg-gray-800 text-white rounded hover:bg-gray-700">
                    Add Root Directory
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'ai' && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold mb-1">AI Provider Settings</h3>
              
              <div>
                <label className="block mb-1 text-xs font-medium">OpenAI API Key</label>
                <input
                  type="password"
                  value={settings.openai_api_key || ''}
                  onChange={(e) => {
                    updateSettings({ openai_api_key: e.target.value })
                    setHasChanges(true)
                  }}
                  placeholder="sk-..."
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs font-medium">OpenAI Model</label>
                <select
                  value={settings.openai_model}
                  onChange={(e) => {
                    updateSettings({ openai_model: e.target.value })
                    setHasChanges(true)
                  }}
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="o3">O3 (Latest)</option>
                  <option value="gpt-4o">GPT-4 Optimized</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-xs font-medium">TTS Provider</label>
                <select
                  value={settings.tts_provider}
                  onChange={(e) => {
                    updateSettings({ tts_provider: e.target.value })
                    setHasChanges(true)
                  }}
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="openai">OpenAI TTS</option>
                  <option value="piper">Piper (Local)</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-xs font-medium">STT Provider</label>
                <select
                  value={settings.stt_provider}
                  onChange={(e) => {
                    updateSettings({ stt_provider: e.target.value })
                    setHasChanges(true)
                  }}
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="openai">OpenAI Whisper</option>
                  <option value="whisper.cpp">Whisper.cpp (Local)</option>
                </select>
              </div>
            </div>
          )}
          
          {activeTab === 'voice' && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold mb-1">Voice Settings</h3>
              
              <div>
                <label className="flex items-center justify-between p-2 bg-black rounded-md">
                  <div>
                    <div className="text-xs font-medium">Voice Enabled</div>
                    <div className="text-xs text-gray-400">Enable voice input and output</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.voice_enabled}
                    onChange={(e) => {
                      updateSettings({ voice_enabled: e.target.checked })
                      setHasChanges(true)
                    }}
                    className="w-4 h-4 text-gray-400 rounded"
                  />
                </label>
              </div>
              
              <div>
                <label className="block mb-1 text-xs font-medium">Wake Word</label>
                <input
                  type="text"
                  value={settings.voice_settings.wake_word}
                  onChange={(e) => {
                    updateSettings({ 
                      voice_settings: { ...settings.voice_settings, wake_word: e.target.value }
                    })
                    setHasChanges(true)
                  }}
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs font-medium">Response Voice</label>
                <select
                  value={settings.voice_settings.response_voice}
                  onChange={(e) => {
                    updateSettings({ 
                      voice_settings: { ...settings.voice_settings, response_voice: e.target.value }
                    })
                    setHasChanges(true)
                  }}
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="maple">Maple</option>
                  <option value="alloy">Alloy</option>
                  <option value="echo">Echo</option>
                  <option value="fable">Fable</option>
                  <option value="onyx">Onyx</option>
                  <option value="nova">Nova</option>
                  <option value="shimmer">Shimmer</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center justify-between p-2 bg-black rounded-md">
                  <div>
                    <div className="text-xs font-medium">Auto-speak Responses</div>
                    <div className="text-xs text-gray-400">Automatically speak AI responses</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.voice_settings.auto_speak_responses}
                    onChange={(e) => {
                      updateSettings({ 
                        voice_settings: { ...settings.voice_settings, auto_speak_responses: e.target.checked }
                      })
                      setHasChanges(true)
                    }}
                    className="w-4 h-4 text-gray-400 rounded"
                  />
                </label>
              </div>
              
              <div>
                <label className="flex items-center justify-between p-2 bg-black rounded-md">
                  <div>
                    <div className="text-xs font-medium">Noise Suppression</div>
                    <div className="text-xs text-gray-400">Filter background noise</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.voice_settings.noise_suppression}
                    onChange={(e) => {
                      updateSettings({ 
                        voice_settings: { ...settings.voice_settings, noise_suppression: e.target.checked }
                      })
                      setHasChanges(true)
                    }}
                    className="w-4 h-4 text-gray-400 rounded"
                  />
                </label>
              </div>
            </div>
          )}
          
          {activeTab === 'terminal' && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold mb-1">Terminal Settings</h3>
              
              <div>
                <label className="block mb-1 text-xs font-medium">Shell</label>
                <input
                  type="text"
                  value={settings.terminal_settings.shell}
                  onChange={(e) => {
                    updateSettings({ 
                      terminal_settings: { ...settings.terminal_settings, shell: e.target.value }
                    })
                    setHasChanges(true)
                  }}
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs font-medium">Font Family</label>
                <input
                  type="text"
                  value={settings.terminal_settings.font_family}
                  onChange={(e) => {
                    updateSettings({ 
                      terminal_settings: { ...settings.terminal_settings, font_family: e.target.value }
                    })
                    setHasChanges(true)
                  }}
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs font-medium">Font Size</label>
                <input
                  type="number"
                  value={settings.terminal_settings.font_size}
                  onChange={(e) => {
                    updateSettings({ 
                      terminal_settings: { ...settings.terminal_settings, font_size: parseInt(e.target.value) }
                    })
                    setHasChanges(true)
                  }}
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs font-medium">Cursor Style</label>
                <select
                  value={settings.terminal_settings.cursor_style}
                  onChange={(e) => {
                    updateSettings({ 
                      terminal_settings: { ...settings.terminal_settings, cursor_style: e.target.value }
                    })
                    setHasChanges(true)
                  }}
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="block">Block</option>
                  <option value="underline">Underline</option>
                  <option value="bar">Bar</option>
                </select>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold mb-1">Security Settings</h3>
              
              <div>
                <label className="block mb-1 text-xs font-medium">Audit Retention Days</label>
                <input
                  type="number"
                  value={settings.security_settings.audit_retention_days}
                  onChange={(e) => {
                    updateSettings({ 
                      security_settings: { ...settings.security_settings, audit_retention_days: parseInt(e.target.value) }
                    })
                    setHasChanges(true)
                  }}
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label className="flex items-center justify-between p-2 bg-black rounded-md">
                  <div>
                    <div className="text-xs font-medium">Require Confirmation</div>
                    <div className="text-xs text-gray-400">Ask before executing potentially dangerous commands</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security_settings.require_confirmation}
                    onChange={(e) => {
                      updateSettings({ 
                        security_settings: { ...settings.security_settings, require_confirmation: e.target.checked }
                      })
                      setHasChanges(true)
                    }}
                    className="w-4 h-4 text-gray-400 rounded"
                  />
                </label>
              </div>
              
              <div>
                <label className="flex items-center justify-between p-2 bg-black rounded-md">
                  <div>
                    <div className="text-xs font-medium">Sandbox Plugins</div>
                    <div className="text-xs text-gray-400">Run plugins in isolated environment</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security_settings.sandbox_plugins}
                    onChange={(e) => {
                      updateSettings({ 
                        security_settings: { ...settings.security_settings, sandbox_plugins: e.target.checked }
                      })
                      setHasChanges(true)
                    }}
                    className="w-4 h-4 text-gray-400 rounded"
                  />
                </label>
              </div>
              
              <div>
                <label className="block mb-1 text-xs font-medium">Max File Size (MB)</label>
                <input
                  type="number"
                  value={settings.security_settings.max_file_size_mb}
                  onChange={(e) => {
                    updateSettings({ 
                      security_settings: { ...settings.security_settings, max_file_size_mb: parseInt(e.target.value) }
                    })
                    setHasChanges(true)
                  }}
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'appearance' && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold mb-1">Appearance Settings</h3>
              
              <div>
                <label className="block mb-1 text-xs font-medium">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => {
                    updateSettings({ theme: e.target.value })
                    setHasChanges(true)
                  }}
                  className="w-full px-2 py-0.5 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-xs font-medium">Window Size</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={settings.window_bounds.width}
                    onChange={(e) => {
                      updateSettings({ 
                        window_bounds: { ...settings.window_bounds, width: parseInt(e.target.value) }
                      })
                      setHasChanges(true)
                    }}
                    placeholder="Width"
                    className="px-2 py-1 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                  <input
                    type="number"
                    value={settings.window_bounds.height}
                    onChange={(e) => {
                      updateSettings({ 
                        window_bounds: { ...settings.window_bounds, height: parseInt(e.target.value) }
                      })
                      setHasChanges(true)
                    }}
                    placeholder="Height"
                    className="px-2 py-1 text-xs bg-black rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Bar */}
        {hasChanges && (
          <div className="sticky bottom-0 px-3 py-2 bg-gray-850 border-t border-gray-800 flex items-center justify-end space-x-1">
            <button
              onClick={handleReset}
              className="px-2 py-0.5 text-xs bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors flex items-center"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </button>
            <button
              onClick={handleSave}
              className="px-2 py-0.5 text-xs bg-black text-white rounded hover:bg-gray-900 transition-colors flex items-center"
            >
              <Save className="w-3 h-3 mr-1" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}