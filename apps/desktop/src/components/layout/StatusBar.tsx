import React from 'react'
import { Wifi, WifiOff, Mic, MicOff, HardDrive, Cpu } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

export function StatusBar() {
  const { settings, updateSettings, isVoiceActive } = useAppStore()
  const { offline_mode: offlineMode, voice_enabled: voiceEnabled } = settings
  
  return (
    <div className="h-6 bg-black border-t border-gray-900 flex items-center justify-between px-2 text-xs text-gray-400">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => updateSettings({ offline_mode: !offlineMode })}
          className={`flex items-center space-x-1 hover:text-gray-200 transition-colors ${
            offlineMode ? 'text-orange-400' : 'text-green-400'
          }`}
        >
          {offlineMode ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
          <span>{offlineMode ? 'Offline' : 'Online'}</span>
        </button>
        
        <button
          onClick={() => updateSettings({ voice_enabled: !voiceEnabled })}
          className={`flex items-center space-x-1 hover:text-gray-200 transition-colors ${
            voiceEnabled ? 'text-green-400' : 'text-gray-500'
          }`}
        >
          {voiceEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
          <span>{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
        </button>
      </div>
      
      {/* Center Section */}
      <div className="flex items-center space-x-4">
        <span>Ready</span>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Cpu className="w-3 h-3" />
          <span>CPU: 12%</span>
        </div>
        <div className="flex items-center space-x-1">
          <HardDrive className="w-3 h-3" />
          <span>Mem: 2.4GB</span>
        </div>
      </div>
    </div>
  )
}