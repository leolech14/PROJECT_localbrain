// FILE: apps/desktop/src/pages/Welcome.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Mic, Terminal, Shield } from 'lucide-react'

export function Welcome() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/chat')
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-2 text-center">
        <div className="mb-1">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
            <Brain className="w-4 h-4" />
          </div>
          <h1 className="text-sm font-bold mb-2">Welcome to LocalBrain</h1>
          <p className="text-sm text-gray-300 mb-1">
            Your AI-powered local environment command center
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-1">
          <div className="bg-black p-3 rounded-md">
            <Mic className="w-4 h-4 text-gray-400 mb-2 mx-auto" />
            <h3 className="text-sm font-semibold mb-1">Voice Control</h3>
            <p className="text-gray-400 text-xs">
              Natural voice commands with wake-word detection and real-time speech processing
            </p>
          </div>

          <div className="bg-black p-3 rounded-md">
            <Terminal className="w-4 h-4 text-green-400 mb-2 mx-auto" />
            <h3 className="text-sm font-semibold mb-1">Integrated Terminal</h3>
            <p className="text-gray-400 text-xs">
              Multi-tab terminal with AI-aware command execution and output analysis
            </p>
          </div>

          <div className="bg-black p-3 rounded-md">
            <Shield className="w-4 h-4 text-purple-400 mb-2 mx-auto" />
            <h3 className="text-sm font-semibold mb-1">Privacy First</h3>
            <p className="text-gray-400 text-xs">
              Sandboxed file access, encrypted settings, and optional offline mode
            </p>
          </div>
        </div>

        <button
          onClick={handleGetStarted}
          className="px-2 py-1.5 bg-black hover:bg-gray-900 rounded-md text-sm font-medium transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}