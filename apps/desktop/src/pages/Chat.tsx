// FILE: apps/desktop/src/pages/Chat.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { cn } from '../utils/cn'

export function Chat() {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  const { 
    messages, 
    sendMessage, 
    clearChat,
    isVoiceActive,
    startVoiceSession,
    stopVoiceSession
  } = useAppStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    await sendMessage(input.trim())
    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      await stopVoiceSession()
      setIsRecording(false)
    } else {
      await startVoiceSession({ type: 'chain' })
      setIsRecording(true)
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <h1 className="text-sm font-semibold">Chat</h1>
        <button
          onClick={clearChat}
          className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-center">
            <div>
              <h2 className="text-sm font-semibold mb-2">Welcome to LocalBrain</h2>
              <p>Start a conversation by typing a message or using voice input.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "chat-message",
                message.role === 'user' && "user",
                message.role === 'assistant' && "assistant",
                message.role === 'system' && "system"
              )}
            >
              <div className="flex items-start space-x-3">
                <div className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center text-sm font-medium",
                  message.role === 'user' ? "bg-black" : 
                  message.role === 'assistant' ? "bg-green-600" : "bg-gray-600"
                )}>
                  {message.role === 'user' ? 'U' : 
                   message.role === 'assistant' ? 'A' : 'S'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium capitalize">{message.role}</span>
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {message.content}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
              rows={1}
              style={{
                minHeight: '40px',
                maxHeight: '120px',
              }}
            />
          </div>
          
          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={cn(
              "p-2 rounded-md transition-colors",
              isRecording 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            )}
            title={isRecording ? "Stop recording" : "Start voice recording"}
          >
            {isRecording ? (
              <MicOff className="w-3 h-3" />
            ) : (
              <Mic className="w-3 h-3" />
            )}
          </button>
          
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 bg-black hover:bg-gray-900 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md transition-colors"
            title="Send message"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
        
        {isVoiceActive && (
          <div className="mt-2 text-xs text-green-400 flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Voice session active
          </div>
        )}
      </div>
    </div>
  )
}